<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Item extends Model
{
    protected $guarded = [];
    
    protected $casts = [
        'published_at' => 'datetime',
        'question_json' => 'array',
    ];
    
    /**
     * Relación: Un item puede tener un stimulus.
     */
    public function stimulus(): BelongsTo
    {
        return $this->belongsTo(Stimulus::class);
    }
    
    /**
     * Relación: Un item tiene muchas opciones (choices).
     */
    public function choices(): HasMany
    {
        return $this->hasMany(Choice::class);
    }
    
    /**
     * Relación: Un item tiene una solución.
     */
    public function solution(): HasOne
    {
        return $this->hasOne(ItemSolution::class);
    }
    
    /**
     * Relación: Un item pertenece a un área.
     */
    public function area(): BelongsTo
    {
        return $this->belongsTo(Area::class);
    }
    
    /**
     * Relación: Un item pertenece a un tema.
     */
    public function tema(): BelongsTo
    {
        return $this->belongsTo(Tema::class);
    }
    
    /**
     * Relación: Un item pertenece a un subtema.
     */
    public function subtema(): BelongsTo
    {
        return $this->belongsTo(Subtema::class);
    }
    
    /**
     * Relación: Un item fue creado por un usuario.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    
    /**
     * Relación: Un item fue actualizado por un usuario.
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
