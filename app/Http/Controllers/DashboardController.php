<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $communityStats = [
            'activeUsers' => User::count(),
            'problemSolved' => 1250,
            'SuccessRate' => 78
        ];

        $personalStats = [
            'practiceStreak' => 5, // Días de racha
            'overallAccuracy' => 72, // Precisión general del usuario
            'communityAverage' => 65, // Precisión promedio de la plataforma
            'weakestTopics' => [ // Los 3 temas con peor rendimiento
                ['name' => 'Leyes de Newton', 'accuracy' => 45, 'link' => '#'],
                ['name' => 'Comprensión Lectora', 'accuracy' => 52, 'link' => '#'],
                ['name' => 'Teorías Pedagógicas', 'accuracy' => 55, 'link' => '#'],
            ],
        ];

        // A futuro, esta será una consulta real al "ítem del día"
        $communityChallenge = [
            'title' => 'El Desafío de la Semana',
            'description' => 'El 80% de los usuarios falló este ítem. ¿Puedes resolverlo?',
            'link' => '#', // Link al ítem
        ];

        return Inertia::render('Dashboard', [
            'stats' => $communityStats,
            'personalStats' => $personalStats,
            'communityChallenge' => $communityChallenge
        ]);
    }
}
