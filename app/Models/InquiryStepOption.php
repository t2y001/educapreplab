<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InquiryStepOption extends Model
{
    protected $fillable = [
        'inquiry_step_id',
        'option_label',
        'option_text',
        'is_correct',
        'feedback',
        'order',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    // Relaciones
    public function inquiryStep(): BelongsTo
    {
        return $this->belongsTo(InquiryStep::class);
    }

    // Scope
    public function scopeCorrect($query)
    {
        return $query->where('is_correct', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
