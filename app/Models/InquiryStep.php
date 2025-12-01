<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InquiryStep extends Model
{
    protected $fillable = [
        'inquiry_id',
        'order',
        'step_type',
        'title',
        'content',
        'simulator_config',
        'xp_reward',
        'is_required',
    ];

    protected $casts = [
        'content' => 'array',
        'simulator_config' => 'array',
        'is_required' => 'boolean',
    ];

    // Relaciones
    public function inquiry(): BelongsTo
    {
        return $this->belongsTo(Inquiry::class);
    }

    public function options(): HasMany
    {
        return $this->hasMany(InquiryStepOption::class)->orderBy('order');
    }

    public function responses(): HasMany
    {
        return $this->hasMany(InquiryStepResponse::class);
    }

    public function assets(): HasMany
    {
        return $this->hasMany(InquiryAsset::class);
    }

    public function stats()
    {
        return $this->hasOne(InquiryStepStats::class);
    }

    // Métodos de utilidad
    public function isMultipleChoice(): bool
    {
        return $this->step_type === 'multiple_choice';
    }

    public function hasSimulator(): bool
    {
        return $this->step_type === 'experiment' && !empty($this->simulator_config);
    }

    public function getSimulatorType(): ?string
    {
        return $this->simulator_config['type'] ?? null;
    }

    // Scope para ordenar
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}