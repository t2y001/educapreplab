<?php

namespace App\Http\Controllers;

use App\Models\Area; // Asegúrate de tener el modelo Area
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProfesorController extends Controller
{
    public function index()
    {
        // CAMBIO: Usamos la relación en singular 'estadisticaProblema'
        $areas = Area::with('estadisticaProblema')->get()->map(function ($area) {
            return [
                'id' => $area->slug,
                'title' => $area->nombre,
                'description' => $area->descripcion,
                // CAMBIO: Accedemos directamente a la propiedad. Usamos '?? 0' por si no existe la relación.
                'problemCount' => $area->estadisticaProblema->total_problemas ?? 0,
                'link' => route('profesores.area', $area->slug),
            ];
        });

        return Inertia::render('Profesores/Index', [
            'subjects' => $areas
        ]);
    }
}