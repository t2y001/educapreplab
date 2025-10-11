<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EstadisticaProblema extends Model
{
    protected $table = 'estadisticas_problemas';
    public $timestamps = false;

    protected $fillable = [
        'area_id',
        'curso_id',
        'total_problemas',
        'ultima_actualizacion',
    ];

    protected $casts = [
        'ultima_actualizacion' => 'datetime',
    ];

    public function area(): BelongsTo
    {
        return $this->belongsTo(Area::class, 'area_id');
    }
}
