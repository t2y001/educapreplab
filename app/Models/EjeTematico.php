<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EjeTematico extends Model
{
    protected $table = 'ejes_tematicos';
    protected $fillable = ['tema_id','nombre','nombre_corto','slug','descripcion'];

    public function tema(): BelongsTo
    {
        return $this->belongsTo(Tema::class, 'tema_id');
    }

    public function subtemas(): HasMany
    {
        return $this->hasMany(Subtema::class, 'eje_id');
    }
}
