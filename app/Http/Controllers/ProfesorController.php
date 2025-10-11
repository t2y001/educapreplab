<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Support\Subscriptions;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ProfesorController extends Controller
{
    public function index()
{
    $areas = Area::query()
        ->with(['temas:id,area_id,nombre']) // traemos temas
        ->select('areas.*')
        ->selectSub(
            'COALESCE((SELECT total_problemas FROM estadisticas_problemas ep WHERE ep.area_id = areas.id LIMIT 1), 0)',
            'problemCount'
        )
        ->orderBy('areas.nombre')
        ->get();

    $subjects = $areas->map(function ($a) {
        return [
            'id'           => (string) $a->slug,                      // match con subjectAssets
            'title'        => (string) $a->nombre,
            'description'  => (string) ($a->descripcion ?? ''),
            'problemCount' => (int) $a->problemCount,
            'audienciaId'  => (int) $a->audiencia_id,
            'link'         => '/profesores/' . (int) $a->audiencia_id . '/' . (string) $a->slug,
            // NUEVO: topics desde BD (máx 6)
            'topics'       => $a->temas->pluck('nombre')->take(6)->values()->all(),
        ];
    });

    return Inertia::render('Profesores/Index', [
        'subjects' => $subjects,
    ]);
}


    public function showArea($audienciaId, Area $area, Request $request)
{
    // 1) Validaciones básicas
    abort_unless((int) $area->audiencia_id === (int) $audienciaId, 404);

    // 2) Parámetros de filtro
    $temaId    = $request->integer('tema_id') ?: null;
    $ejeId     = $request->integer('eje_id') ?: null;
    $subtemaId = $request->integer('subtema_id') ?: null;
    $mode      = $request->string('mode', 'temas')->toString(); // 'temas' | 'random' | 'random_adaptive'

    // 3) Visibilidad y suscripción
    $userId        = optional(auth()->user())->id;
    $isSubscriber  = (bool) (auth()->user()?->isSubscriber ?? false); // ajusta a tu lógica real
    $visibilitySet = ['public'];
    if (auth()->check()) {
        // Si manejas visibilidad 'subscribers' en BD, agrégala para usuarios logueados.
        // Si quieres que solo suscriptores vean 'subscribers', cámbialo a: if ($isSubscriber) { ... }
        $visibilitySet[] = 'subscribers';
    }

    // Si no es suscriptor, degradar 'random_adaptive' a 'random'
    if ($mode === 'random_adaptive' && !$isSubscriber) {
        $mode = 'random';
    }

    // 4) Cargar estructura para el sidebar (Temas → Ejes → Subtemas)
    $area->load([
        'estadistica',
        'temas' => fn($q) => $q->select('id','area_id','nombre','nombre_corto','slug')->orderBy('nombre'),
        'temas.ejesTematicos' => fn($q) => $q->select('id','tema_id','nombre','nombre_corto','slug')->orderBy('nombre'),
        'temas.ejesTematicos.subtemas' => fn($q) => $q->select('id','tema_id','eje_id','nombre','nombre_corto','slug')->orderBy('nombre'),
        'temas.subtemas' => fn($q) => $q->select('id','tema_id','eje_id','nombre','nombre_corto','slug')->whereNull('eje_id')->orderBy('nombre'),
    ]);

    // 5) Query base de items (publicados + visibilidad + pertenencia al área)
    $itemsQ = DB::table('items')
        ->select('items.id','items.stimulus_id','items.answer_key')
        ->where('items.status', 'published')
        ->whereIn('items.visibility', $visibilitySet)
        ->where(function($q) use ($area) {
            $q->where('items.area_id', $area->id)
              ->orWhereIn('items.tema_id', function($sq) use ($area) {
                  $sq->from('temas')->select('id')->where('area_id', $area->id);
              });
        });

    // 6) Aplicar filtros según modo
    if ($mode === 'temas') {
        if ($temaId)    $itemsQ->where('items.tema_id', $temaId);
        if ($ejeId)     $itemsQ->where('items.eje_id', $ejeId);
        if ($subtemaId) $itemsQ->where('items.subtema_id', $subtemaId);
        $itemsQ->orderBy('items.id', 'desc');
    } elseif ($mode === 'random') {
        // aleatorio simple (mantiene filtros de área)
        $itemsQ->inRandomOrder();
    } else { // 'random_adaptive'
        // Excluir ya respondidos por el usuario (si está logueado)
        if ($userId) {
            $itemsQ->whereNotIn('items.id', function($sq) use ($userId) {
                $sq->from('user_item_history')->select('item_id')->where('user_id', $userId);
            });
        }
        // Semilla de adaptativo simple: apuntar a 'medium' con mezcla rand de easy/hard
        $itemsQ->where(function($q){
            $q->where('items.difficulty', 'medium')
              ->orWhere(function($q2){ $q2->where('items.difficulty','easy')->whereRaw('RAND() < 0.30'); })
              ->orWhere(function($q3){ $q3->where('items.difficulty','hard')->whereRaw('RAND() < 0.30'); });
        })->inRandomOrder();
    }

    // 7) Paginación/Límites
    $page    = max(1, (int)($request->integer('page') ?: 1));
    $perPage = (int)($request->integer('per_page') ?: 10);
    $perPage = min(20, max(1, $perPage));
    // Si quieres uno por uno en random, descomenta:
    // if ($mode !== 'temas') { $perPage = 10; } // o 1, según tu UX

    // Nota: contar con RAND() es caro; en random/random_adaptive podemos omitir el total real
    $needAccurateTotal = ($mode === 'temas');

    $total = $needAccurateTotal ? (clone $itemsQ)->count() : 0;

    if ($needAccurateTotal) {
        $offset = ($page - 1) * $perPage;
        $itemsQ->offset($offset)->limit($perPage);
    } else {
        // Random: solo limit
        $itemsQ->limit($perPage);
    }

    $itemRows = $itemsQ->get();
    $itemIds     = $itemRows->pluck('id')->all();
    $stimulusIds = $itemRows->pluck('stimulus_id')->filter()->unique()->all();

    // 8) Cargar contenidos por lote
    $itemContents = DB::table('item_contents')
        ->select('item_id','content_json')
        ->whereIn('item_id', $itemIds)
        ->where('is_current', true)
        ->get()
        ->keyBy('item_id');

    $choicesRows = DB::table('choices')
        ->select('item_id','label','content_json')
        ->whereIn('item_id', $itemIds)
        ->orderBy('label')
        ->get()
        ->groupBy('item_id');

    $solutions = DB::table('item_solutions')
        ->select('item_id','explanation_json','misconception_json','visibility')
        ->whereIn('item_id', $itemIds)
        ->get()
        ->keyBy('item_id');

    $stimulusContents = [];
    if (!empty($stimulusIds)) {
        $stimulusContents = DB::table('stimulus_contents')
            ->join('stimuli','stimuli.id','=','stimulus_contents.stimulus_id')
            ->whereIn('stimulus_id', $stimulusIds)
            ->where('stimulus_contents.is_current', true)
            ->where('stimuli.status','published')
            ->whereIn('stimuli.visibility', $visibilitySet)
            ->select('stimulus_id', 'content_json', 'stimuli.author')
            ->get()
            ->keyBy('stimulus_id');
    }

    // === MÉTRICAS DE COMUNIDAD (por item) ===
    $stats = DB::table('user_item_history')
    ->selectRaw('item_id, AVG(time_sec) as avg_time_sec, COUNT(*) as attempts, AVG(is_correct) as correct_rate')
    ->whereIn('item_id', $itemIds)
    ->groupBy('item_id')
    ->get()
    ->keyBy('item_id');


    // 9) Armar DTO de problems
    $problems = $itemRows->map(function($row) use ($itemContents, $choicesRows, $solutions, $stimulusContents, $stats) {
        // Choices A/B/C (si falta alguna, pongo bloque mínimo)
        $labels = ['A','B','C'];
        $choicesForItem = ($choicesRows[$row->id] ?? collect());
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

        // Solución: no aplico política de ocultar aquí; si quieres ocultar a no-suscriptores, filtra antes de asignar.
        $sol = $solutions->get($row->id);
        $solution = null;
        if ($sol) {
            $solution = [
                'explanation_json'   => $sol->explanation_json ? json_decode($sol->explanation_json, true) : [],
                'misconception_json' => $sol->misconception_json ? json_decode($sol->misconception_json, true) : null,
                'visibility'         => $sol->visibility,
            ];
        }

        // Stats de comunidad
        $st = $stats->get($row->id);
        $avgTime = $st?->avg_time_sec ? (int) round($st->avg_time_sec) : null;
        $correctRate = $st?->correct_rate !== null ? (float) $st->correct_rate : null;
        $communityDifficulty = null;
        if ($correctRate !== null) {
            // regla simple: >=80% fácil, >=50% medio, si no difícil
            $communityDifficulty = $correctRate >= 0.8 ? 'fácil' : ($correctRate >= 0.5 ? 'media' : 'difícil');
        }

        return [
            'id'              => (int)$row->id,
            'answer_key'      => $row->answer_key, // 'A' | 'B' | 'C'
            'stimulus_blocks' => $row->stimulus_id ? (json_decode(optional($stimulusContents[$row->stimulus_id] ?? null)->content_json ?? '[]', true)) : [],
            'item_blocks'     => json_decode(optional($itemContents[$row->id] ?? null)->content_json ?? '[]', true),
            'choices'         => $choices,
            'solution'        => $solution,
            'stats'           => [
                'avg_time_sec'       => $avgTime, // segundos
                'attempts'           => $st?->attempts ? (int) $st?->attempts : 0,
                'correct_rate'        => $correctRate, // 0.0 a 1.0
                'community_difficulty'=> $communityDifficulty, // 'fácil' | 'media' | 'difícil' | null
            ],
            'stimulus_author' => optional($stimulusContents[$row->stimulus_id] ?? null)->author
        ];
    });

    // 10) Paginación (para random no calculamos total real)
    $pagination = [
        'page'    => $page,
        'perPage' => $perPage,
        'total'   => $needAccurateTotal ? $total : 0,
        'hasMore' => $needAccurateTotal ? (($page * $perPage) < $total) : true, // en random asumimos que hay más
    ];

    // 11) Payload Inertia
    return Inertia::render('Profesores/SubjectPage', [
        'subject' => [
            'slug'         => (string) $area->slug,
            'title'        => (string) $area->nombre,
            'audienciaId'  => (int) $audienciaId,
            'audiencia'    => '',
            'descripcion'  => (string) ($area->descripcion ?? ''),
            'problemCount' => (int) ($area->estadistica->total_problemas ?? 0),
        ],
        'topics' => $area->temas->map(function($t){
            return [
                'id'            => (int) $t->id,
                'nombre'        => (string) $t->nombre,
                'nombreCorto'   => (string) ($t->nombre_corto ?? ''),
                'slug'          => (string) ($t->slug ?? ''),
                'ejes'          => $t->ejesTematicos->map(fn($e)=>[
                    'id'           => (int) $e->id,
                    'nombre'       => (string) $e->nombre,
                    'nombreCorto'  => (string) ($e->nombre_corto ?? ''),
                    'slug'         => (string) ($e->slug ?? ''),
                    'subtemas'     => $e->subtemas->map(fn($s)=>[
                        'id'          => (int) $s->id,
                        'nombre'      => (string) $s->nombre,
                        'nombreCorto' => (string) ($s->nombre_corto ?? ''),
                        'slug'        => (string) ($s->slug ?? ''),
                    ])->values(),
                ])->values(),
                'standaloneSubtopics' => $t->subtemas->map(fn($s)=>[
                    'id'          => (int) $s->id,
                    'nombre'      => (string) $s->nombre,
                    'nombreCorto' => (string) ($s->nombre_corto ?? ''),
                    'slug'        => (string) ($s->slug ?? ''),
                ])->values(),
            ];
        })->values(),
        'problems' => $problems,
        'pagination' => $pagination,
        'activeFilters' => [
            'tema_id'    => $temaId,
            'eje_id'     => $ejeId,
            'subtema_id' => $subtemaId,
            'mode'       => $mode,
        ],
        // (Opcional) expón si el user es suscriptor para el front:
        'user' => auth()->check() ? [
            'id' => $userId,
            'name' => auth()->user()->name ?? '',
            'isSubscriber' => $isSubscriber,
        ] : null,
    ]);
}


}
