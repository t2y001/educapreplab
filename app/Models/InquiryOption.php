<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InquiryOption extends Model
{
    use HasFactory;

    protected $guarded = [];

    /**
     * Definimos que 'is_correct' es un booleano.
     */
    protected $casts = [
        'is_correct' => 'boolean',
    ];

    /**
     * Relación: Una opción pertenece a un Paso de Indagación.
     */
    public function inquiryStep()
    {
        return $this->belongsTo(InquiryStep::class);
    }
}