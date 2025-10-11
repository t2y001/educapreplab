<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ImportTestlet extends Command
{
    protected $signature = 'testlets:import 
        {path : Ruta al JSON del testlet} 
        {--visibility=public : public|subscribers|private}';

    protected $description = 'Importa un testlet (estímulo + items) al esquema stimuli/items/choices/solutions.';

    public function handle()
    {
        $path = (string) $this->argument('path');
        if (!is_file($path)) {
            $this->error("No se encontró el archivo: {$path}");
            return self::FAILURE;
        }

        $json = file_get_contents($path);
        $data = json_decode($json, true);
        if (!is_array($data)) {
            $this->error("JSON inválido en: {$path}");
            return self::FAILURE;
        }

        $visibilityOpt = strtolower((string)$this->option('visibility'));
        $visibility = in_array($visibilityOpt, ['public','subscribers','private'], true) ? $visibilityOpt : 'public';

        // ===================== Helpers =====================
        $mapDifficulty = function (?string $d): ?string {
            $d = strtolower((string)$d);
            return match ($d) {
                'alta'  => 'hard',
                'media' => 'medium',
                'baja'  => 'easy',
                default => null,
            };
        };

        $mapLetter = function (?string $l): string {
            $l = strtolower((string)$l);
            return match ($l) { 'a' => 'A', 'b' => 'B', default => 'C' };
        };

        $mapBlock = function (array $b) use (&$mapBlock): array {
            $tipo = strtolower($b['tipo'] ?? 'parrafo');
            switch ($tipo) {
                case 'parrafo':
                    return [
                        'type' => 'paragraph',
                        'data' => [
                            'text'   => (string)($b['valor'] ?? ''),
                            'shaded' => (bool)($b['shaded'] ?? false),
                        ],
                    ];
                case 'html':
                    return [
                        'type' => 'html',
                        'data' => ['html' => (string)($b['html'] ?? '')],
                    ];
                case 'imagen':
                    return [
                        'type' => 'image',
                        'data' => [
                            'src'     => (string)($b['src'] ?? ''),
                            'alt'     => (string)($b['alt'] ?? ''),
                            'caption' => (string)($b['caption'] ?? ''),
                        ],
                    ];
                case 'tabla':
                    return [
                        'type' => 'table',
                        'data' => [
                            'headers' => $b['headers'] ?? [],
                            'rows'    => $b['rows'] ?? [],
                        ],
                    ];
                case 'lista':
                    return [
                        'type' => 'list',
                        'data' => [
                            'style' => $b['style'] ?? 'bulleted', // 'bulleted' | 'numbered'
                            'items' => $b['items'] ?? [],
                        ],
                    ];
                case 'callout':
                    $inner = [];
                    foreach (($b['blocks'] ?? []) as $ib) {
                        $inner[] = $mapBlock($ib);
                    }
                    return [
                        'type' => 'callout',
                        'data' => [
                            'variant' => $b['variant'] ?? 'muted', // para estilos (muted/info/warning)
                            'blocks'  => $inner,
                        ],
                    ];
                default:
                    // Fallback
                    return [
                        'type' => 'paragraph',
                        'data' => ['text' => (string)($b['valor'] ?? '')],
                    ];
            }
        };

        // ===================== Validación mínima =====================
        if (empty($data['id_testlet'])) {
            $this->error("Falta 'id_testlet' en el JSON.");
            return self::FAILURE;
        }
        if (empty($data['estimulo']['contenido']) || !is_array($data['estimulo']['contenido'])) {
            $this->error("Falta 'estimulo.contenido' (array de bloques).");
            return self::FAILURE;
        }
        if (empty($data['items']) || !is_array($data['items'])) {
            $this->error("Falta 'items' (array).");
            return self::FAILURE;
        }

        // ===================== Import =====================
        return DB::transaction(function () use ($data, $visibility, $mapDifficulty, $mapLetter, $mapBlock) {

            // ---- Area (opcional) ----
            $areaId = null;
            if (!empty($data['area_id'])) {
                $areaId = (int) $data['area_id'];
            } elseif (!empty($data['area_curricular'])) {
                $areaId = DB::table('areas')->where('nombre', $data['area_curricular'])->value('id');
            }

            // ---- Stimulus (idempotente por source=id_testlet) ----
            $stimulusId = DB::table('stimuli')->where('source', $data['id_testlet'])->value('id');

            $author = $data['source'] ?? null;

            $stimulusPayload = [
                'titulo'       => !empty($data['estimulo']['titulo']) ? $data['estimulo']['titulo'] : $data['id_testlet'],
                'area_id'      => $areaId,
                'visibility'   => $visibility,
                'status'       => $data['status'] ?? 'published',
                'source'       => $data['id_testlet'],
                'origin'       => ($data['origin'] ?? 'human') === 'ai' ? 'ai' : 'human',
                'author'       => $author,
                'updated_at'   => now(),
                'published_at' => now(),
            ];

            if ($stimulusId) {
                DB::table('stimuli')->where('id', $stimulusId)->update($stimulusPayload);
                DB::table('stimulus_contents')->where('stimulus_id', $stimulusId)->update(['is_current' => false]);
            } else {
                $stimulusId = DB::table('stimuli')->insertGetId(array_merge($stimulusPayload, [
                    'created_at' => now(),
                ]));
            }

            // ---- Stimulus contents (blocks) ----
            $stimulusBlocks = [];
            foreach ($data['estimulo']['contenido'] as $b) {
                $stimulusBlocks[] = $mapBlock($b);
            }
            DB::table('stimulus_contents')->insert([
                'stimulus_id' => $stimulusId,
                'content_json'=> json_encode($stimulusBlocks, JSON_UNESCAPED_UNICODE),
                'version'     => 1,
                'is_current'  => true,
                'created_at'  => now(),
            ]);

            // ---- Items ----
            $inserted = 0;
            foreach ($data['items'] as $it) {
                if (empty($it['id_item'])) {
                    $this->warn("Item sin 'id_item' -> saltado.");
                    continue;
                }

                // Currículo desde subtema_id (si viene)
                $temaId = null; $ejeId = null; $subtemaId = $it['subtema_id'] ?? null;
                if ($subtemaId) {
                    $row = DB::table('subtemas')->select('tema_id','eje_id')->where('id', $subtemaId)->first();
                    if ($row) { $temaId = $row->tema_id; $ejeId = $row->eje_id; }
                } else {
                    // fallback si viniera explícito en el JSON
                    $temaId = $it['tema_id'] ?? null;
                    $ejeId  = $it['eje_id']  ?? null;
                }

                // dificultad/complejidad
                $difRaw = $it['dificultad'] ?? $it['complejidad'] ?? null;
                $difficulty = $mapDifficulty($difRaw);

                // Crear o actualizar por source=id_item
                $existsId = DB::table('items')->where('source', $it['id_item'])->value('id');
                $itemBase = [
                    'stimulus_id'        => $stimulusId,
                    'area_id'            => $areaId,
                    'tema_id'            => $temaId,
                    'eje_id'             => $ejeId,
                    'subtema_id'         => $subtemaId,
                    'difficulty'         => $difficulty,
                    'time_estimate_sec'  => $it['metadata']['tiempo_estimado_seg'] ?? null,
                    'answer_key'         => $mapLetter($it['respuesta_correcta'] ?? 'C'),
                    'visibility'         => $data['visibility'] ?? $visibility,
                    'status'             => $data['status'] ?? 'published',
                    'source'             => $it['id_item'], // ID externo estable
                    'origin'             => ($data['origin'] ?? 'human') === 'ai' ? 'ai' : 'human',
                    'author'             => $author, // mismo autor del estímulo
                    'updated_at'         => now(),
                    'published_at'       => now(),
                ];

                if ($existsId) {
                    DB::table('items')->where('id', $existsId)->update($itemBase);
                    $itemId = (int) $existsId;
                    // invalidar versiones previas
                    DB::table('item_contents')->where('item_id', $itemId)->update(['is_current' => false]);
                    DB::table('choices')->where('item_id', $itemId)->delete();
                    DB::table('item_solutions')->where('item_id', $itemId)->delete();
                } else {
                    $itemId = DB::table('items')->insertGetId(array_merge($itemBase, [
                        'created_at' => now(),
                    ]));
                }

                // ---- Item contents (enunciado) ----
                $itemBlocks = [];
                if (!empty($it['pregunta_bloques']) && is_array($it['pregunta_bloques'])) {
                    foreach ($it['pregunta_bloques'] as $pb) {
                        $itemBlocks[] = $mapBlock($pb);
                    }
                } else {
                    $itemBlocks[] = [
                        'type' => 'paragraph',
                        'data' => ['text' => (string)($it['pregunta'] ?? '')],
                    ];
                }

                DB::table('item_contents')->insert([
                    'item_id'      => $itemId,
                    'content_json' => json_encode($itemBlocks, JSON_UNESCAPED_UNICODE),
                    'version'      => 1,
                    'is_current'   => true,
                    'created_at'   => now(),
                ]);

                // ---- Choices A/B/C ----
                $labels = ['A','B','C'];
                $byLabel = [];
                foreach (($it['alternativas'] ?? []) as $alt) {
                    $lbl = $mapLetter($alt['alternativa'] ?? 'C');
                    // bloques > html > texto
                    if (!empty($alt['bloques']) && is_array($alt['bloques'])) {
                        $blocks = [];
                        foreach ($alt['bloques'] as $b) $blocks[] = $mapBlock($b);
                    } elseif (!empty($alt['html'])) {
                        $blocks = [['type'=>'html','data'=>['html'=>(string)$alt['html']]]];
                    } else {
                        $blocks = [['type'=>'paragraph','data'=>['text'=>(string)($alt['texto'] ?? '(sin contenido)')]]];
                    }
                    $byLabel[$lbl] = $blocks;
                }

                foreach ($labels as $L) {
                    $blocks = $byLabel[$L] ?? [['type'=>'paragraph','data'=>['text'=>'(sin contenido)']]];
                    DB::table('choices')->insert([
                        'item_id'      => $itemId,
                        'label'        => $L,
                        'content_json' => json_encode($blocks, JSON_UNESCAPED_UNICODE),
                        'created_at'   => now(),
                        'updated_at'   => now(),
                    ]);
                }

                // ---- Solution + misconception ----
                $exp = [];
                if (!empty($it['justificacion_bloques']) && is_array($it['justificacion_bloques'])) {
                    foreach ($it['justificacion_bloques'] as $b) $exp[] = $mapBlock($b);
                } elseif (!empty($it['justificacion'])) {
                    $exp[] = ['type'=>'paragraph','data'=>['text'=>(string)$it['justificacion']]];
                }

                $mis = null;
                if (!empty($it['concepcion_bloques']) && is_array($it['concepcion_bloques'])) {
                    $tmp = [];
                    foreach ($it['concepcion_bloques'] as $b) $tmp[] = $mapBlock($b);
                    $mis = $tmp;
                } elseif (!empty($it['concepcion_alternativa'])) {
                    $mis = [['type'=>'paragraph','data'=>['text'=>(string)$it['concepcion_alternativa']]]];
                }

                DB::table('item_solutions')->insert([
                    'item_id'            => $itemId,
                    'explanation_json'   => json_encode($exp, JSON_UNESCAPED_UNICODE),
                    'misconception_json' => $mis ? json_encode($mis, JSON_UNESCAPED_UNICODE) : null,
                    'visibility'         => 'inherit',
                    'created_by'         => null,
                    'created_at'         => now(),
                    'updated_at'         => now(),
                ]);

                $inserted++;
            }

            $this->info("Importado testlet {$data['id_testlet']} con {$inserted} ítems.");
            return self::SUCCESS;
        });
    }
}
