<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GamificationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GamificationController extends Controller
{
    protected GamificationService $gamificationService;

    public function __construct(GamificationService $gamificationService)
    {
        $this->gamificationService = $gamificationService;
    }

    /**
     * Obtener estadísticas de gamificación del usuario
     */
    public function getStats(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $stats = $this->gamificationService->getUserStats($userId);

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Obtener logros del usuario
     */
    public function getAchievements(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $includeSecret = $request->boolean('include_secret', false);
        
        $achievements = $this->gamificationService->getUserAchievements($userId, $includeSecret);

        return response()->json([
            'success' => true,
            'data' => $achievements,
        ]);
    }

    /**
     * Otorgar XP manualmente (solo para testing o admin)
     */
    public function awardXp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|integer|min:1',
            'action_type' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $result = $this->gamificationService->awardXp(
            $validated['user_id'],
            $validated['amount'],
            $validated['action_type'],
            null,
            null,
            $validated['description'] ?? null
        );

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Obtener leaderboard
     */
    public function getLeaderboard(Request $request): JsonResponse
    {
        // TODO: Implementar cuando tengamos la tabla de leaderboards poblada
        return response()->json([
            'success' => true,
            'data' => [],
            'message' => 'Leaderboard coming soon',
        ]);
    }
}
