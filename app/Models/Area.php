<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne; // CAMBIO: Usamos HasOne

class Area extends Model
{
    use HasFactory;

    /**
     * Indica a Laravel que no gestione automáticamente las columnas created_at y updated_at.
     */
    public $timestamps = false;

    /**
     * Define los campos que se pueden asignar masivamente.
     */
    protected $fillable = [
        'audiencia_id',
        'nombre',
        'slug',
        'descripcion',
    ];

    /**
     * Define la relación con el modelo Audience.
     */
    public function audience(): BelongsTo
    {
        return $this->belongsTo(Audience::class, 'audiencia_id');
    }

    /**
     * Define la relación con el modelo EstadisticaProblema.
     */
    public function estadisticaProblema(): HasOne // CAMBIO: Relación uno a uno
    {
        return $this->hasOne(EstadisticaProblema::class);
    }
}
