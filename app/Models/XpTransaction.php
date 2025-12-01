<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class XpTransaction extends Model
{
    public $timestamps = false;
    
    protected $fillable = [
        'user_id',
        'amount',
        'action_type',
        'reference_type',
        'reference_id',
        'description',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    // Relaciones
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Método para obtener la referencia polimórfica
    public function getReference()
    {
        if (!$this->reference_type || !$this->reference_id) {
            return null;
        }

        $class = "App\\Models\\{$this->reference_type}";
        
        if (class_exists($class)) {
            return $class::find($this->reference_id);
        }

        return null;
    }
}
