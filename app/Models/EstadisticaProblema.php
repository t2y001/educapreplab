<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EstadisticaProblema extends Model
{
    use HasFactory;

    protected $table = 'estadisticas_problemas'; // Especifica el nombre de la tabla
    public $timestamps = false; // Indica que no tienes created_at/updated_at
}
