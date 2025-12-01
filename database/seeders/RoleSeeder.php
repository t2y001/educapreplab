<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'profesor_lider'],
            ['name' => 'estudiante'],
        ];
        
        foreach ($roles as $role) {
            \DB::table('roles')->updateOrInsert(
                ['name' => $role['name']],
                $role
            );
        }
        
        $this->command->info('Roles creados: profesor_lider, estudiante');
    }
}
