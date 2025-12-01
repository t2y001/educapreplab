<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InquiryStepResponse extends Model
{
    protected $fillable = [
        'user_id',
        'inquiry_id',
        'inquiry_step_id',
        'inquiry_step_option_id',
        'response_data',
        'is_correct',
        'attempts',
        'time_spent',
    ];

    protected $casts = [
        'response_data' => 'array',
        'is_correct' => 'boolean',
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

    public function inquiryStep(): BelongsTo
    {
        return $this->belongsTo(InquiryStep::class);
    }

    public function selectedOption(): BelongsTo
    {
        return $this->belongsTo(InquiryStepOption::class, 'inquiry_step_option_id');
    }

    // Métodos de utilidad
    public function incrementAttempts(): void
    {
        $this->increment('attempts');
    }

    public function addTimeSpent(int $seconds): void
    {
        $this->increment('time_spent', $seconds);
    }

    // Scopes
    public function scopeCorrect($query)
    {
        return $query->where('is_correct', true);
    }

    public function scopeIncorrect($query)
    {
        return $query->where('is_correct', false);
    }

    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeRecent($query, int $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }
}
