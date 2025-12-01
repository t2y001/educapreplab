<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserInquiryProgress extends Model
{
    protected $table = 'user_inquiry_progress';
    
    protected $fillable = [
        'user_id',
        'inquiry_id',
        'current_step',
        'data',
        'completed',
        'score',
        'time_spent',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'data' => 'array',
        'completed' => 'boolean',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    // Relaciones
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function inquiry(): BelongsTo
    {
        return $this->belongsTo(Inquiry::class);
    }

    // Métodos de utilidad
    public function saveStepData(int $step, array $stepData): void
    {
        $data = $this->data ?? [];
        $data["step_{$step}"] = $stepData;
        $this->data = $data;
        $this->current_step = max($this->current_step, $step);
        $this->save();
    }

    public function getStepData(int $step): ?array
    {
        return $this->data["step_{$step}"] ?? null;
    }

    public function markAsCompleted(int $score = null): void
    {
        $this->completed = true;
        $this->completed_at = now();
        if ($score !== null) {
            $this->score = $score;
        }
        $this->save();
    }
}
