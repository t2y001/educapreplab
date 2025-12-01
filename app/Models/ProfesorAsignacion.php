<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProfesorAsignacion extends Model
{
    protected $table = 'profesor_asignaciones';
    
    protected $fillable = [
        'user_id',
        'area_id',
        'audiencia_id',
        'rol',
    ];
    
    /**
     * Relación: Una asignación pertenece a un usuario (profesor).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Relación: Una asignación pertenece a un área.
     */
    public function area(): BelongsTo
    {
        return $this->belongsTo(Area::class);
    }
    
    /**
     * Relación: Una asignación pertenece a una audiencia.
     */
    public function audiencia(): BelongsTo
    {
        return $this->belongsTo(Audiencia::class);
    }
}
