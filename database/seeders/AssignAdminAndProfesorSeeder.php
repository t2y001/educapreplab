<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\ProfesorAsignacion;

class AssignAdminAndProfesorSeeder extends Seeder
{
    public function run(): void
    {
        // Asignar rol admin al usuario ID 1
        $user = User::find(1);
        if ($user) {
            $adminRole = Role::where('name', 'admin')->first();
            if ($adminRole && !$user->roles()->where('role_id', $adminRole->id)->exists()) {
                $user->roles()->attach($adminRole->id);
                $this->command->info("Usuario {$user->name} asignado como admin");
            }
            
            // También asignar como profesor_lider
            $profesorRole = Role::where('name', 'profesor_lider')->first();
            if ($profesorRole && !$user->roles()->where('role_id', $profesorRole->id)->exists()) {
                $user->roles()->attach($profesorRole->id);
                $this->command->info("Usuario {$user->name} asignado como profesor_lider");
            }
            
            // Crear asignación de profesor para Ciencia y Tecnología - Docentes MINEDU
            ProfesorAsignacion::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'area_id' => 1, // Ciencia y Tecnología
                    'audiencia_id' => 1, // Docentes MINEDU
                ],
                [
                    'rol' => 'lider'
                ]
            );
            
            $this->command->info("Asignación de profesor creada para Ciencia y Tecnología - Docentes MINEDU");
        }
    }
}
