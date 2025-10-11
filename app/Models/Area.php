<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne; 

class Area extends Model
{
    protected $table = 'areas';
    protected $fillable = ['audiencia_id', 'nombre', 'slug', 'descripcion'];

    /**
     * Define la relación con el modelo Audience.
     */
    public function audience(): BelongsTo
    {
        return $this->belongsTo(Audiencia::class, 'audiencia_id');
    }

    /**
     * Define la relación con el modelo EstadisticaProblema.
     */
    public function estadistica(): HasOne
    {
        return $this->hasOne(EstadisticaProblema::class, 'area_id');
    }

    public function temas(): HasMany
    {
        return $this->hasMany(Tema::class, 'area_id');
    }
}
