<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InquiryStep extends Model
{
    use HasFactory;

    protected $guarded = [];

    /**
     * Definimos que la columna 'simulation_data' es un JSON/array.
     */
    protected $casts = [
        'simulation_data' => 'array',
    ];

    /**
     * Relación: Un paso pertenece a una Indagación.
     */
    public function inquiry()
    {
        return $this->belongsTo(Inquiry::class);
    }

    /**
     * Relación: Un paso (si es 'multiple_choice') tiene muchas opciones.
     */
    public function inquiryOptions()
    {
        return $this->hasMany(InquiryOption::class);
    }
}