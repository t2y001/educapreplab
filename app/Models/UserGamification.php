<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserGamification extends Model
{
    protected $table = 'user_gamification';
    
    protected $fillable = [
        'user_id',
        'level',
        'xp',
        'total_xp',
        'scientist_title',
        'current_streak',
        'longest_streak',
        'last_activity_date',
    ];

    protected $casts = [
        'last_activity_date' => 'date',
    ];

    // Relaciones
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function xpTransactions(): HasMany
    {
        return $this->hasMany(XpTransaction::class, 'user_id', 'user_id');
    }

    // Métodos de utilidad
    public function getXpForNextLevel(): int
    {
        return (int) floor(100 * pow($this->level + 1, 1.5));
    }

    public function getProgressPercentage(): float
    {
        $xpNeeded = $this->getXpForNextLevel();
        return ($this->xp / $xpNeeded) * 100;
    }

    public function canLevelUp(): bool
    {
        return $this->xp >= $this->getXpForNextLevel();
    }

    public function getTitleForLevel(int $level = null): string
    {
        $lvl = $level ?? $this->level;
        
        return match(true) {
            $lvl >= 19 => 'Científico Legendario',
            $lvl >= 16 => 'Maestro de la Indagación',
            $lvl >= 13 => 'Investigador Experto',
            $lvl >= 10 => 'Científico en Formación',
            $lvl >= 7 => 'Investigador Junior',
            $lvl >= 4 => 'Explorador Científico',
            default => 'Aprendiz Curioso',
        };
    }
}
