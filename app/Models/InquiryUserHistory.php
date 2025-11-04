<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InquiryUserHistory extends Model
{
    use HasFactory;

    protected $guarded = [];

    /**
     * No usamos 'updated_at' en esta tabla.
     */
    public $timestamps = false;

    /**
     * Definimos los tipos de datos.
     */
    protected $casts = [
        'is_correct' => 'boolean',
        'answered_at' => 'datetime',
    ];

    /**
     * Relación: Un registro de historial pertenece a un Usuario.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación: Un registro de historial pertenece a un Paso.
     */
    public function inquiryStep()
    {
        return $this->belongsTo(InquiryStep::class);
    }

    /**
     * Relación: Un registro de historial (si es opción múltiple) tiene una opción seleccionada.
     */
    public function selectedOption()
    {
        return $this->belongsTo(InquiryOption::class, 'selected_option_id');
    }
}