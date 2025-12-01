<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemSolution extends Model
{
    protected $guarded = [];
    
    protected $casts = [
        'explanation_json' => 'array',
        'misconception_json' => 'array',
    ];
    
    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
