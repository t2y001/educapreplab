<?php

namespace App\Http\Controllers;

use App\Support\Subscriptions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class SimulacroController extends Controller
{
    /**
     * Lista del módulo de simulacros (solo suscriptores).
     * Muestra plan, cupo restante y últimos simulacros creados por el usuario.
     */
    public function index()
    {
        $user = Auth::user();
        abort_unless($user, 403);

        $plan = Subscriptions::userPlan($user->id);
        $canStart = Subscriptions::canUseSimulacro($user->id);

        // últimos 10 simulacros del usuario (solo id/título/fecha/estado)
        $recentExams = DB::table('exams')
            ->select('id','titulo','status','created_at','published_at')
            ->where('created_by', $user->id)
            ->orderByDesc('id')
            ->limit(10)
            ->get();

        // consumo del mes
        $remaining = null;
        if ($plan && $plan->monthly_simulacros_limit !== null) {
            $used = DB::table('user_simulacro_usage')
                ->where('user_id', $user->id)
                ->where('period_month', now()->startOfMonth()->toDateString())
                ->value('used') ?? 0;
            $remaining = max(0, (int)$plan->monthly_simulacros_limit - (int)$used);
        }

        return Inertia::render('Simulacros/Index', [
            'plan' => $plan ? [
                'name' => $plan->name,
                'limit' => $plan->monthly_simulacros_limit,
                'period_start' => $plan->current_period_start,
                'period_end'   => $plan->current_period_end,
            ] : null,
            'canStart'  => $canStart,
            'remaining' => $remaining, // null = ilimitado
            'recentExams' => $recentExams,
        ]);
    }

    /**
     * Crea (arma) un simulacro para el usuario y redirige a show().
     * Valida cupo y selecciona ítems agrupados por estímulo.
     *
     * Body esperado (todo opcional):
     * - per_stimulus: int (n° ítems por estímulo, default 2)
     * - total_items: int (total ítems deseados, default 20)
     * - area_id: int|null
     * - tema_ids: int[]|null
     * - difficulty: 'easy'|'medium'|'hard'|null (mezcla si null)
     */
    public function create(Request $request)
    {
        $user = Auth::user();
        abort_unless($user, 403);

        // cupo por suscripción
        abort_unless(Subscriptions::canUseSimulacro($user->id), 402); // Payment Required

        $data = $request->validate([
            'per_stimulus' => 'nullable|integer|min:1|max:10',
            'total_items'  => 'nullable|integer|min:3|max:200',
            'area_id'      => 'nullable|integer|min:1',
            'tema_ids'     => 'nullable|array',
            'tema_ids.*'   => 'integer|min:1',
            'difficulty'   => 'nullable|in:easy,medium,hard',
            'titulo'       => 'nullable|string|max:255',
            'descripcion'  => 'nullable|string|max:2000',
        ]);

        $perStimulus = $data['per_stimulus'] ?? 2;
        $targetTotal = $data['total_items']  ?? 20;
        $areaId      = $data['area_id']      ?? null;
        $temaIds     = $data['tema_ids']     ?? null;
        $difficulty  = $data['difficulty']   ?? null;

        // visibilidad disponible según suscripción (user logueado: 'public' + 'subscribers')
        $visibility = ['public','subscribers'];

        // 1) Elegir estímulos candidatos
        $stimulusQ = DB::table('stimuli')
            ->select('id')
            ->where('status', 'published')
            ->whereIn('visibility', $visibility);

        if ($areaId) {
            $stimulusQ->where('area_id', $areaId);
        }
        if ($temaIds && count($temaIds) > 0) {
            $stimulusQ->whereIn('tema_id', $temaIds);
        }

        // Para evitar estímulos sin ítems válidos, filtraremos luego; por ahora, RANDOM
        $stimulusIds = $stimulusQ->inRandomOrder()->limit(200)->pluck('id')->all(); // top 200 candidatos

        if (empty($stimulusIds)) {
            return back()->with('error', 'No se encontraron estímulos para armar el simulacro con los filtros dados.');
        }

        // 2) Para cada estímulo, selecciona hasta $perStimulus ítems válidos
        $picked = []; // array de ['stimulus_id'=>int, 'item_ids'=>[...]]
        $totalPicked = 0;

        foreach ($stimulusIds as $sid) {
            if ($totalPicked >= $targetTotal) break;

            $itemsQ = DB::table('items')
                ->select('id')
                ->where('status', 'published')
                ->whereIn('visibility', $visibility)
                ->where('stimulus_id', $sid);

            if ($areaId) $itemsQ->where('area_id', $areaId);
            if ($temaIds && count($temaIds) > 0) $itemsQ->whereIn('tema_id', $temaIds);
            if ($difficulty) $itemsQ->where('difficulty', $difficulty);

            $ids = $itemsQ->inRandomOrder()->limit($perStimulus)->pluck('id')->all();

            if (!empty($ids)) {
                $picked[] = ['stimulus_id' => $sid, 'item_ids' => $ids];
                $totalPicked += count($ids);
            }
        }

        if ($totalPicked === 0) {
            return back()->with('error', 'No se encontraron ítems para armar el simulacro.');
        }

        // 3) Persistir examen + bloques + items en transacción
        $examId = DB::transaction(function () use ($user, $data, $picked, $targetTotal) {
            $examId = DB::table('exams')->insertGetId([
                'titulo'       => $data['titulo'] ?? 'Simulacro',
                'descripcion'  => $data['descripcion'] ?? null,
                'visibility'   => 'subscribers',
                'status'       => 'published',
                'created_by'   => $user->id,
                'published_at' => now(),
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);

            $position = 1;
            foreach ($picked as $block) {
                $blockId = DB::table('exam_blocks')->insertGetId([
                    'exam_id'     => $examId,
                    'position'    => $position++,
                    'stimulus_id' => $block['stimulus_id'],
                    'created_at'  => now(),
                ]);

                $iPos = 1;
                foreach ($block['item_ids'] as $itemId) {
                    DB::table('exam_block_items')->insert([
                        'exam_block_id' => $blockId,
                        'item_id'       => $itemId,
                        'position'      => $iPos++,
                    ]);
                }
            }

            return $examId;
        });

        // 4) Registrar el consumo del simulacro
        Subscriptions::increaseSimulacroUsage($user->id);

        // 5) Redirigir a la ejecución del simulacro
        return redirect()->route('simulacros.show', ['exam' => $examId]);
    }

    /**
     * Muestra un simulacro armado (estímulos + ítems por bloques) para el usuario.
     * Restringe el acceso al creador (o cambia política si deseas compartir).
     */
    public function show($examId)
    {
        $user = Auth::user();
        abort_unless($user, 403);

        $exam = DB::table('exams')->where('id', $examId)->first();
        abort_if(!$exam, 404);
        abort_unless((int)$exam->created_by === (int)$user->id, 403); // propiedad del simulacro

        // Cargar bloques del examen
        $blocks = DB::table('exam_blocks')
            ->select('id','position','stimulus_id')
            ->where('exam_id', $examId)
            ->orderBy('position')
            ->get();

        if ($blocks->isEmpty()) {
            return Inertia::render('Simulacros/Take', [
                'exam'   => ['id' => (int)$examId, 'titulo' => $exam->titulo, 'descripcion' => $exam->descripcion],
                'blocks' => [],
            ]);
        }

        $blockIds    = $blocks->pluck('id')->all();
        $stimulusIds = $blocks->pluck('stimulus_id')->filter()->unique()->all();

        // Ítems por bloque
        $blockItems = DB::table('exam_block_items')
            ->select('exam_block_id','item_id','position')
            ->whereIn('exam_block_id', $blockIds)
            ->orderBy('exam_block_id')->orderBy('position')
            ->get()
            ->groupBy('exam_block_id');

        $itemIds = $blockItems->flatten()->pluck('item_id')->unique()->all();

        // Contenidos ítems
        $itemContents = DB::table('item_contents')
            ->select('item_id','content_json')
            ->whereIn('item_id', $itemIds)
            ->where('is_current', true)
            ->get()
            ->keyBy('item_id');

        // Choices
        $choicesRows = DB::table('choices')
            ->select('item_id','label','content_json')
            ->whereIn('item_id', $itemIds)
            ->orderBy('label')
            ->get()
            ->groupBy('item_id');

        // Solutions
        $solutions = DB::table('item_solutions')
            ->select('item_id','explanation_json','misconception_json','visibility')
            ->whereIn('item_id', $itemIds)
            ->get()
            ->keyBy('item_id');

        // Métricas comunidad
        $stats = DB::table('user_item_history')
            ->selectRaw('item_id, AVG(time_sec) as avg_time_sec, COUNT(*) as attempts, AVG(is_correct) as correct_rate')
            ->whereIn('item_id', $itemIds)
            ->groupBy('item_id')
            ->get()
            ->keyBy('item_id');

        // Estímulos
        $stimulusContent = [];
        if (!empty($stimulusIds)) {
            $stimulusContent = DB::table('stimulus_contents')
                ->join('stimuli','stimuli.id','=','stimulus_contents.stimulus_id')
                ->whereIn('stimulus_id', $stimulusIds)
                ->where('stimulus_contents.is_current', true)
                ->where('stimuli.status','published')
                ->select('stimulus_id','content_json')
                ->get()
                ->keyBy('stimulus_id');
        }

        // Armar payload por bloque
        $blocksDTO = $blocks->map(function($b) use ($blockItems, $itemContents, $choicesRows, $solutions, $stats, $stimulusContent) {
            $itemsRows = $blockItems->get($b->id) ?? collect();

            $itemsDTO = $itemsRows->map(function($ir) use ($itemContents, $choicesRows, $solutions, $stats) {
                $labels = ['A','B','C'];
                $choicesForItem = ($choicesRows[$ir->item_id] ?? collect());

                $choices = array_map(function($lbl) use ($choicesForItem) {
                    $found = $choicesForItem->firstWhere('label', $lbl);
                    $payload = $found?->content_json ?? json_encode([
                        ['type'=>'paragraph','data'=>['text'=>'(sin contenido)']]
                    ]);
                    return [
                        'label' => $lbl,
                        'content_json' => is_string($payload) ? json_decode($payload, true) : $payload,
                    ];
                }, $labels);

                $sol = $solutions->get($ir->item_id);
                $solution = $sol ? [
                    'explanation_json'   => $sol->explanation_json ? json_decode($sol->explanation_json, true) : [],
                    'misconception_json' => $sol->misconception_json ? json_decode($sol->misconception_json, true) : null,
                    'visibility'         => $sol->visibility,
                ] : null;

                $st = $stats->get($ir->item_id);
                $avgTime = $st?->avg_time_sec ? (int) round($st->avg_time_sec) : null;
                $correctRate = $st?->correct_rate !== null ? (float) $st->correct_rate : null;
                $communityDifficulty = null;
                if ($correctRate !== null) {
                    $communityDifficulty = $correctRate >= 0.8 ? 'fácil' : ($correctRate >= 0.5 ? 'media' : 'difícil');
                }

                return [
                    'id'              => (int)$ir->item_id,
                    'item_blocks'     => json_decode(optional($itemContents[$ir->item_id] ?? null)->content_json ?? '[]', true),
                    'choices'         => $choices,
                    'solution'        => $solution,
                    'stats' => [
                        'avg_time_sec'         => $avgTime,
                        'correct_rate'         => $correctRate,
                        'attempts'             => $st?->attempts ? (int)$st->attempts : 0,
                        'community_difficulty' => $communityDifficulty,
                    ],
                ];
            })->values();

            return [
                'position'        => (int)$b->position,
                'stimulus_blocks' => $b->stimulus_id ? (json_decode(optional($stimulusContent[$b->stimulus_id] ?? null)->content_json ?? '[]', true)) : [],
                'items'           => $itemsDTO,
            ];
        })->values();

        return Inertia::render('Simulacros/Take', [
            'exam' => [
                'id'          => (int)$exam->id,
                'titulo'      => (string)$exam->titulo,
                'descripcion' => (string)($exam->descripcion ?? ''),
                'created_at'  => $exam->created_at,
            ],
            'blocks' => $blocksDTO,
        ]);
    }
}
