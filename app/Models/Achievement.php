<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Achievement extends Model
{
    protected $fillable = [
        'code',
        'name',
        'description',
        'category',
        'icon',
        'xp_reward',
        'rarity',
        'criteria',
        'is_secret',
    ];

    protected $casts = [
        'criteria' => 'array',
        'is_secret' => 'boolean',
    ];

    // Relaciones
    public function userAchievements(): HasMany
    {
        return $this->hasMany(UserAchievement::class);
    }

    // Métodos de utilidad
    public function isUnlockedBy(int $userId): bool
    {
        return $this->userAchievements()
            ->where('user_id', $userId)
            ->where('completed', true)
            ->exists();
    }

    public function getProgressFor(int $userId): int
    {
        $userAchievement = $this->userAchievements()
            ->where('user_id', $userId)
            ->first();
            
        return $userAchievement?->progress ?? 0;
    }
}
