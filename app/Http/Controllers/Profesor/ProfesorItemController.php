<?php

namespace App\Http\Controllers\Profesor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Item;
use App\Models\Area;
use App\Models\Tema;
use App\Models\Subtema;
use App\Models\Stimulus;
use App\Models\Choice;
use App\Models\ItemSolution;

class ProfesorItemController extends Controller
{
    /**
     * Display a listing of the professor's items.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Obtener items creados por el profesor
        $items = Item::where('created_by', $user->id)
            ->with(['stimulus'])
            ->orderBy('updated_at', 'desc')
            ->paginate(20);
        
        return Inertia::render('Profesor/Items/Index', [
            'items' => $items,
        ]);
    }

    /**
     * Show the form for creating a new item.
     */
    public function create(Request $request)
    {
        $user = $request->user();
        
        // Obtener áreas asignadas al profesor
        $asignaciones = $user->profesorAsignaciones()->with(['area'])->get();
        $areaIds = $asignaciones->pluck('area_id')->filter()->unique();
        
        // Cargar datos necesarios
        $audiencias = \App\Models\Audiencia::all();
        $areas = Area::all(); // Mostrar todas, filtrar en frontend
        $temas = Tema::all();
        $subtemas = Subtema::all();
        
        return Inertia::render('Profesor/Items/Create', [
            'audiencias' => $audiencias,
            'areas' => $areas,
            'temas' => $temas,
            'subtemas' => $subtemas,
        ]);
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subtema_id' => 'required|exists:subtemas,id',
            'difficulty' => 'required|in:easy,medium,hard',
            'answer_key' => 'required|in:A,B,C,D',
            'visibility' => 'required|in:public,subscribers,private',
            'author' => 'nullable|string|max:150',
            'question_json' => 'required|array',
            'stimulus_blocks' => 'nullable|array',
            'choices' => 'required|array',
            'explanation_json' => 'nullable|array',
        ]);
        
        // Obtener jerarquía completa del subtema
        $subtema = Subtema::with('tema.area')->findOrFail($validated['subtema_id']);
        
        // Crear stimulus si se proporcionó
        $stimulusId = null;
        if ($request->stimulus_blocks && count($request->stimulus_blocks) > 0) {
            // Crear el stimulus (sin content_json)
            $stimulus = Stimulus::create([
                'visibility' => $validated['visibility'],
                'status' => 'published',
                'author' => $validated['author'] ?? null,
            ]);
            $stimulusId = $stimulus->id;
            
            // Guardar el contenido en stimulus_contents (sistema de versionado)
            DB::table('stimulus_contents')->insert([
                'stimulus_id' => $stimulusId,
                'content_json' => json_encode(['blocks' => $request->stimulus_blocks]),
                'is_current' => true,
                'created_at' => now(),
            ]);
        }
        
        // Crear item
        $item = Item::create([
            'subtema_id' => $validated['subtema_id'],
            'tema_id' => $subtema->tema_id,
            'eje_id' => $subtema->tema->eje_id ?? null,
            'area_id' => $subtema->tema->area_id,
            'stimulus_id' => $stimulusId,
            'difficulty' => $validated['difficulty'],
            'answer_key' => $validated['answer_key'],
            'visibility' => $validated['visibility'],
            'author' => $validated['author'] ?? null,
            'explanation_visibility' => $validated['visibility'], // Mismo que el item
            'status' => 'draft',
            'source' => 'profesor-' . auth()->id() . '-' . time(),
            'origin' => 'human',
            'created_by' => auth()->id(),
            'question_json' => $validated['question_json'],
        ]);
        
        // Crear choices
        foreach ($validated['choices'] as $choice) {
            Choice::create([
                'item_id' => $item->id,
                'letter' => $choice['letter'],
                'order_index' => $choice['order_index'],
                'content_json' => $choice['content_json'],
            ]);
        }
        
        // Crear solution si hay explicación
        if ($request->explanation_json) {
            ItemSolution::create([
                'item_id' => $item->id,
                'explanation_json' => $request->explanation_json,
            ]);
        }
        
        return redirect()->route('profesor.items.index')
            ->with('message', 'Item creado correctamente');
    }

    /**
     * Display the specified item.
     */
    public function show(Item $item)
    {
        // Verificar que el profesor puede ver este item
        if ($item->created_by !== auth()->id() && !auth()->user()->isAdmin()) {
            abort(403, 'No tienes permiso para ver este item.');
        }
        
        $item->load(['stimulus', 'choices', 'solution']);
        
        return Inertia::render('Profesor/Items/Show', [
            'item' => $item,
        ]);
    }

    /**
     * Show the form for editing the specified item.
     */
    public function edit(Item $item)
    {
        // Verificar que el profesor puede editar este item
        if ($item->created_by !== auth()->id() && !auth()->user()->isAdmin()) {
            abort(403, 'No tienes permiso para editar este item.');
        }
        
        $item->load(['stimulus', 'choices', 'solution']);
        
        $user = auth()->user();
        $asignaciones = $user->profesorAsignaciones()->with(['area'])->get();
        $areaIds = $asignaciones->pluck('area_id')->filter()->unique();
        
        $areas = Area::whereIn('id', $areaIds)->get();
        $temas = Tema::whereIn('area_id', $areaIds)->get();
        $subtemas = Subtema::whereIn('tema_id', $temas->pluck('id'))->get();
        
        return Inertia::render('Profesor/Items/Edit', [
            'item' => $item,
            'areas' => $areas,
            'temas' => $temas,
            'subtemas' => $subtemas,
        ]);
    }

    /**
     * Update the specified item in storage.
     */
    public function update(Request $request, Item $item)
    {
        // Verificar que el profesor puede editar este item
        if ($item->created_by !== auth()->id() && !auth()->user()->isAdmin()) {
            abort(403, 'No tienes permiso para editar este item.');
        }
        
        // TODO: Implementar actualización de items
        
        return redirect()->route('profesor.items.index')
            ->with('message', 'Funcionalidad de edición en desarrollo');
    }

    /**
     * Remove the specified item from storage.
     */
    public function destroy(Item $item)
    {
        // Verificar que el profesor puede eliminar este item
        if ($item->created_by !== auth()->id() && !auth()->user()->isAdmin()) {
            abort(403, 'No tienes permiso para eliminar este item.');
        }
        
        $item->delete();
        
        return redirect()->route('profesor.items.index')
            ->with('message', 'Item eliminado correctamente');
    }
}
