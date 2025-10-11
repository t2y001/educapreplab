<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subtema extends Model
{
    protected $table = 'subtemas'; // Debe existir esa tabla (aunque esté vacía)
    public $timestamps = false;

    protected $fillable = [
        'tema_id',
        'eje_id',
        'nombre',
        'slug',
        'descripcion'];

    public function tema(): BelongsTo
    {
        return $this->belongsTo(Tema::class, 'tema_id');
    }

    public function eje(): BelongsTo
    {
        return $this->belongsTo(EjeTematico::class, 'eje_id');
    }

}
