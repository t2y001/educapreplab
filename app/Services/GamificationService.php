<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserGamification;
use App\Models\Achievement;
use App\Models\UserAchievement;
use App\Models\XpTransaction;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class GamificationService
{
    /**
     * Otorgar XP a un usuario
     */
    public function awardXp(
        int $userId,
        int $baseAmount,
        string $actionType,
        ?string $referenceType = null,
        ?int $referenceId = null,
        ?string $description = null
    ): array {
        $gamification = $this->getOrCreateGamification($userId);
        
        // Calcular multiplicadores
        $multiplier = 1.0;
        
        // Bonus por racha
        if ($gamification->current_streak >= 7) {
            $multiplier += 0.25; // +25% con racha de 7+ días
        }
        
        // Bonus por primera vez
        if ($this->isFirstTime($userId, $actionType)) {
            $multiplier += 0.50; // +50% primera vez
        }
        
        $finalAmount = (int) floor($baseAmount * $multiplier);
        
        // Registrar transacción
        XpTransaction::create([
            'user_id' => $userId,
            'amount' => $finalAmount,
            'action_type' => $actionType,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'description' => $description ?? "Ganaste {$finalAmount} XP por {$actionType}",
            'created_at' => now(),
        ]);
        
        // Actualizar XP del usuario
        $gamification->xp += $finalAmount;
        $gamification->total_xp += $finalAmount;
        
        // Verificar subida de nivel
        $leveledUp = false;
        $newLevel = $gamification->level;
        
        while ($gamification->canLevelUp()) {
            $xpForNext = $gamification->getXpForNextLevel();
            $gamification->xp -= $xpForNext;
            $gamification->level++;
            $newLevel = $gamification->level;
            $leveledUp = true;
            
            // Actualizar título
            $gamification->scientist_title = $gamification->getTitleForLevel();
        }
        
        $gamification->save();
        
        // Actualizar racha
        $this->updateStreak($userId);
        
        // Verificar logros
        $unlockedAchievements = $this->checkAchievements($userId, $actionType);
        
        return [
            'xp_awarded' => $finalAmount,
            'multiplier' => $multiplier,
            'total_xp' => $gamification->total_xp,
            'current_level' => $gamification->level,
            'leveled_up' => $leveledUp,
            'new_level' => $leveledUp ? $newLevel : null,
            'new_title' => $leveledUp ? $gamification->scientist_title : null,
            'unlocked_achievements' => $unlockedAchievements,
        ];
    }

    /**
     * Obtener o crear gamificación del usuario
     */
    protected function getOrCreateGamification(int $userId): UserGamification
    {
        return UserGamification::firstOrCreate(
            ['user_id' => $userId],
            [
                'level' => 1,
                'xp' => 0,
                'total_xp' => 0,
                'scientist_title' => 'Aprendiz Curioso',
                'current_streak' => 0,
                'longest_streak' => 0,
            ]
        );
    }

    /**
     * Verificar si es la primera vez que realiza una acción
     */
    protected function isFirstTime(int $userId, string $actionType): bool
    {
        return !XpTransaction::where('user_id', $userId)
            ->where('action_type', $actionType)
            ->exists();
    }

    /**
     * Actualizar racha del usuario
     */
    protected function updateStreak(int $userId): void
    {
        $gamification = UserGamification::where('user_id', $userId)->first();
        
        if (!$gamification) {
            return;
        }

        $today = Carbon::today();
        $lastActivity = $gamification->last_activity_date 
            ? Carbon::parse($gamification->last_activity_date) 
            : null;

        if (!$lastActivity || $lastActivity->isSameDay($today)) {
            // Misma fecha, no hacer nada
            $gamification->last_activity_date = $today;
        } elseif ($lastActivity->isYesterday()) {
            // Día consecutivo
            $gamification->current_streak++;
            $gamification->last_activity_date = $today;
            
            if ($gamification->current_streak > $gamification->longest_streak) {
                $gamification->longest_streak = $gamification->current_streak;
            }
        } else {
            // Se rompió la racha
            $gamification->current_streak = 1;
            $gamification->last_activity_date = $today;
        }

        $gamification->save();
    }

    /**
     * Verificar y desbloquear logros
     */
    protected function checkAchievements(int $userId, string $actionType): array
    {
        $unlocked = [];
        
        // Obtener logros relevantes que no estén completados
        $achievements = Achievement::whereJsonContains('criteria->action_type', $actionType)
            ->orWhere('criteria->action_type', 'any')
            ->get();

        foreach ($achievements as $achievement) {
            $userAchievement = UserAchievement::firstOrCreate(
                [
                    'user_id' => $userId,
                    'achievement_id' => $achievement->id,
                ],
                [
                    'progress' => 0,
                    'completed' => false,
                ]
            );

            if ($userAchievement->completed) {
                continue;
            }

            // Incrementar progreso
            $userAchievement->incrementProgress();

            if ($userAchievement->completed) {
                // Otorgar XP del logro
                if ($achievement->xp_reward > 0) {
                    $this->awardXp(
                        $userId,
                        $achievement->xp_reward,
                        'achievement_unlocked',
                        'Achievement',
                        $achievement->id,
                        "Desbloqueaste: {$achievement->name}"
                    );
                }

                $unlocked[] = [
                    'id' => $achievement->id,
                    'name' => $achievement->name,
                    'description' => $achievement->description,
                    'rarity' => $achievement->rarity,
                    'xp_reward' => $achievement->xp_reward,
                ];
            }
        }

        return $unlocked;
    }

    /**
     * Obtener estadísticas del usuario
     */
    public function getUserStats(int $userId): array
    {
        $gamification = $this->getOrCreateGamification($userId);
        
        $totalAchievements = Achievement::count();
        $unlockedAchievements = UserAchievement::where('user_id', $userId)
            ->where('completed', true)
            ->count();

        return [
            'level' => $gamification->level,
            'xp' => $gamification->xp,
            'total_xp' => $gamification->total_xp,
            'xp_for_next_level' => $gamification->getXpForNextLevel(),
            'progress_percentage' => $gamification->getProgressPercentage(),
            'scientist_title' => $gamification->scientist_title,
            'current_streak' => $gamification->current_streak,
            'longest_streak' => $gamification->longest_streak,
            'achievements_unlocked' => $unlockedAchievements,
            'total_achievements' => $totalAchievements,
            'achievement_percentage' => $totalAchievements > 0 
                ? ($unlockedAchievements / $totalAchievements) * 100 
                : 0,
        ];
    }

    /**
     * Obtener logros del usuario
     */
    public function getUserAchievements(int $userId, bool $includeSecret = false): array
    {
        $query = Achievement::with(['userAchievements' => function ($q) use ($userId) {
            $q->where('user_id', $userId);
        }]);

        if (!$includeSecret) {
            $query->where('is_secret', false);
        }

        $achievements = $query->get();

        return $achievements->map(function ($achievement) use ($userId) {
            $userAchievement = $achievement->userAchievements->first();
            
            return [
                'id' => $achievement->id,
                'name' => $achievement->name,
                'description' => $achievement->description,
                'category' => $achievement->category,
                'icon' => $achievement->icon,
                'rarity' => $achievement->rarity,
                'xp_reward' => $achievement->xp_reward,
                'is_secret' => $achievement->is_secret,
                'unlocked' => $userAchievement?->completed ?? false,
                'progress' => $userAchievement?->progress ?? 0,
                'target' => $achievement->criteria['target'] ?? 1,
                'unlocked_at' => $userAchievement?->unlocked_at,
            ];
        })->toArray();
    }

    /**
     * Constantes de XP por acción
     */
    public const XP_REWARDS = [
        'inquiry_guided_completed' => 50,
        'inquiry_semi_guided_completed' => 100,
        'inquiry_open_completed' => 200,
        'hypothesis_correct' => 20,
        'hypothesis_validated' => 10,
        'data_analysis_completed' => 30,
        'experiment_designed' => 40,
        'conclusion_written' => 25,
        'perfect_inquiry' => 100, // Sin errores
        'collaboration_completed' => 75,
        'peer_help' => 15,
    ];
}
