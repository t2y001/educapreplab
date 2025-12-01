<?php

namespace App\Http\Controllers\Profesor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Item;
use App\Models\Inquiry;

class ProfesorDashboardController extends Controller
{
    /**
     * Muestra el dashboard principal del profesor.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Obtener asignaciones del profesor
        $asignaciones = $user->profesorAsignaciones()->with(['area', 'audiencia'])->get();
        
        // Obtener IDs de áreas asignadas
        $areaIds = $asignaciones->pluck('area_id')->filter()->unique();
        
        // Estadísticas de contenido creado por el profesor
        $stats = [
            'total_items' => Item::where('created_by', $user->id)->count(),
            'total_inquiries' => Inquiry::count(), // TODO: Agregar created_by a tabla inquiries
            'items_published' => Item::where('created_by', $user->id)
                ->where('status', 'published')
                ->count(),
            'items_draft' => Item::where('created_by', $user->id)
                ->where('status', 'draft')
                ->count(),
        ];
        
        // Contenido reciente
        $recentItems = Item::where('created_by', $user->id)
            ->with(['stimulus'])
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get();
            
        // TODO: Filtrar por created_by cuando se agregue la columna a inquiries
        $recentInquiries = Inquiry::orderBy('updated_at', 'desc')
            ->limit(5)
            ->get();
        
        return Inertia::render('Profesor/Dashboard', [
            'asignaciones' => $asignaciones,
            'stats' => $stats,
            'recentItems' => $recentItems,
            'recentInquiries' => $recentInquiries,
        ]);
    }
}
