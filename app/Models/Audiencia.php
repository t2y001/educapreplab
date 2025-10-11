<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Audiencia extends Model
{
    protected $table = 'audiencias';
    protected $fillable = ['nombre', 'descripcion'];

    /**
     * Define la relación con el modelo Area.
     * Una audiencia tiene muchas áreas.
     */
    public function areas(): HasMany
    {
        return $this->hasMany(Area::class, 'audiencia_id');
    }
}
