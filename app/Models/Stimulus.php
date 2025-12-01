<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stimulus extends Model
{
    protected $table = 'stimuli';
    protected $guarded = [];
    
    // Note: content_json is stored in stimulus_contents table, not in stimuli
    
    public function items()
    {
        return $this->hasMany(Item::class);
    }
}
