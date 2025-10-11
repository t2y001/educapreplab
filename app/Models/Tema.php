<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tema extends Model
{
    protected $table = 'temas';
    protected $fillable = ['area_id', 'curso_id', 'nombre', 'nombre_corto', 'slug', 'descripcion'];

    public function area(): BelongsTo
    {
        return $this->belongsTo(Area::class, 'area_id');
    }

    public function subtemas(): HasMany
    {
        return $this->hasMany(Subtema::class, 'tema_id');
    }

    public function ejesTematicos(): HasMany
    {
        return $this->hasMany(EjeTematico::class, 'tema_id');
    }
}
