<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Choice extends Model
{
    protected $guarded = [];
    
    protected $casts = [
        'content_json' => 'array',
    ];
    
    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
