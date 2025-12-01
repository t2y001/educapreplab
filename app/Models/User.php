<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    
    /**
     * Relación: Un usuario tiene muchos roles (many-to-many).
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_user', 'user_id', 'role_id');
    }
    
    /**
     * Relación: Un usuario (profesor) tiene muchas asignaciones.
     */
    public function profesorAsignaciones()
    {
        return $this->hasMany(ProfesorAsignacion::class);
    }
    
    /**
     * Verifica si el usuario tiene un rol específico.
     */
    public function hasRole(string $roleName): bool
    {
        return $this->roles()->where('name', $roleName)->exists();
    }
    
    /**
     * Verifica si el usuario es administrador.
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }
    
    /**
     * Verifica si el usuario es profesor (líder o colaborador).
     */
    public function isProfesor(): bool
    {
        return $this->hasRole('profesor_lider');
    }
    
    /**
     * Verifica si el usuario puede editar un contenido específico.
     * Admin puede editar todo, profesor solo su contenido asignado.
     */
    public function canEditContent(int $areaId = null, int $audienciaId = null): bool
    {
        if ($this->isAdmin()) {
            return true;
        }
        
        if (!$this->isProfesor()) {
            return false;
        }
        
        // Si no se especifica área/audiencia, verificar si tiene alguna asignación
        if ($areaId === null && $audienciaId === null) {
            return $this->profesorAsignaciones()->exists();
        }
        
        // Verificar si tiene asignación para el área/audiencia específica
        return $this->profesorAsignaciones()
            ->where(function($query) use ($areaId, $audienciaId) {
                if ($areaId) {
                    $query->where('area_id', $areaId);
                }
                if ($audienciaId) {
                    $query->where('audiencia_id', $audienciaId);
                }
            })
            ->exists();
    }
}
