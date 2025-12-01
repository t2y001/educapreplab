<?php

namespace App\Http\Controllers\Profesor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Inquiry;
use App\Models\Area;
use App\Models\Tema;
use App\Models\Subtema;

class ProfesorInquiryController extends Controller
{
    /**
     * Display a listing of the professor's inquiries.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Obtener indagaciones creadas por el profesor
        // Nota: La tabla inquiries no tiene created_by, necesitaremos agregarlo
        $inquiries = Inquiry::orderBy('updated_at', 'desc')
            ->paginate(20);
        
        return Inertia::render('Profesor/Inquiries/Index', [
            'inquiries' => $inquiries,
        ]);
    }

    /**
     * Show the form for creating a new inquiry.
     */
    public function create(Request $request)
    {
        $user = $request->user();
        
        // Obtener áreas asignadas al profesor
        $asignaciones = $user->profesorAsignaciones()->with(['area'])->get();
        $areaIds = $asignaciones->pluck('area_id')->filter()->unique();
        
        $areas = Area::whereIn('id', $areaIds)->get();
        $temas = Tema::whereIn('area_id', $areaIds)->get();
        $subtemas = Subtema::whereIn('tema_id', $temas->pluck('id'))->get();
        
        return Inertia::render('Profesor/Inquiries/Create', [
            'areas' => $areas,
            'temas' => $temas,
            'subtemas' => $subtemas,
        ]);
    }

    /**
     * Store a newly created inquiry in storage.
     */
    public function store(Request $request)
    {
        // Reutilizar la lógica del AdminInquiryController
        // Por ahora, redirigir
        return redirect()->route('profesor.inquiries.index')
            ->with('message', 'Funcionalidad de creación en desarrollo');
    }

    /**
     * Display the specified inquiry.
     */
    public function show(Inquiry $inquiry)
    {
        $inquiry->load(['steps.inquiryOptions']);
        
        return Inertia::render('Profesor/Inquiries/Show', [
            'inquiry' => $inquiry,
        ]);
    }

    /**
     * Show the form for editing the specified inquiry.
     */
    public function edit(Inquiry $inquiry)
    {
        $inquiry->load(['steps.inquiryOptions']);
        
        $user = auth()->user();
        $asignaciones = $user->profesorAsignaciones()->with(['area'])->get();
        $areaIds = $asignaciones->pluck('area_id')->filter()->unique();
        
        $areas = Area::whereIn('id', $areaIds)->get();
        $temas = Tema::whereIn('area_id', $areaIds)->get();
        $subtemas = Subtema::whereIn('tema_id', $temas->pluck('id'))->get();
        
        return Inertia::render('Profesor/Inquiries/Edit', [
            'inquiry' => $inquiry,
            'areas' => $areas,
            'temas' => $temas,
            'subtemas' => $subtemas,
        ]);
    }

    /**
     * Update the specified inquiry in storage.
     */
    public function update(Request $request, Inquiry $inquiry)
    {
        // TODO: Implementar actualización
        return redirect()->route('profesor.inquiries.index')
            ->with('message', 'Funcionalidad de edición en desarrollo');
    }

    /**
     * Remove the specified inquiry from storage.
     */
    public function destroy(Inquiry $inquiry)
    {
        $inquiry->delete();
        
        return redirect()->route('profesor.inquiries.index')
            ->with('message', 'Indagación eliminada correctamente');
    }
}
