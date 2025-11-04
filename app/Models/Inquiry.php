<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * Para simplificar, permitimos todo, ya que validamos en el controlador.
     */
    protected $guarded = [];

    /**
     * Relación: Una indagación tiene muchos pasos.
     */
    public function inquirySteps()
    {
        // Importante: Los ordenamos por la columna 'order'
        return $this->hasMany(InquiryStep::class)->orderBy('order');
    }

    /**
     * Relación: Una indagación pertenece a un Área.
     */
    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    /**
     * Relación: Una indagación pertenece a un Tema.
     */
    public function tema()
    {
        return $this->belongsTo(Tema::class);
    }

    /**
     * Relación: Una indagación pertenece a un Subtema.
     */
    public function subtema()
    {
        return $this->belongsTo(Subtema::class);
    }
}