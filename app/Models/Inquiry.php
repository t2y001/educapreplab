<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inquiry extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * Para simplificar, permitimos todo, ya que validamos en el controlador.
     */
    protected $guarded = [];

    protected $casts = [
        'content' => 'array',
    ];

    // Relaciones
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function userProgress(): HasMany
    {
        return $this->hasMany(UserInquiryProgress::class);
    }

    // Nuevas relaciones para sistema relacional
    public function steps(): HasMany
    {
        return $this->hasMany(InquiryStep::class)->orderBy('order');
    }

    public function assets(): HasMany
    {
        return $this->hasMany(InquiryAsset::class)->orderBy('order');
    }

    public function responses(): HasMany
    {
        return $this->hasMany(InquiryStepResponse::class);
    }

    // Métodos de utilidad
    public function hasSteps(): bool
    {
        return $this->steps()->exists();
    }

    public function getTotalSteps(): int
    {
        // Soporte para ambos sistemas
        if ($this->hasSteps()) {
            return $this->steps()->count();
        }
        return count($this->content['steps'] ?? []);
    }

    public function getStep(int $stepNumber): ?array
    {
        $steps = $this->content['steps'] ?? [];
        return $steps[$stepNumber - 1] ?? null;
    }
}