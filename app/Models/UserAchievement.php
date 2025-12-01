<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAchievement extends Model
{
    protected $fillable = [
        'user_id',
        'achievement_id',
        'progress',
        'completed',
        'unlocked_at',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'unlocked_at' => 'datetime',
    ];

    // Relaciones
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function achievement(): BelongsTo
    {
        return $this->belongsTo(Achievement::class);
    }

    // Métodos de utilidad
    public function incrementProgress(int $amount = 1): void
    {
        $this->progress += $amount;
        $this->save();
        
        // Verificar si se completó el logro
        $this->checkCompletion();
    }

    protected function checkCompletion(): void
    {
        if ($this->completed) {
            return;
        }

        $criteria = $this->achievement->criteria;
        $target = $criteria['target'] ?? 1;

        if ($this->progress >= $target) {
            $this->completed = true;
            $this->unlocked_at = now();
            $this->save();
        }
    }
}
