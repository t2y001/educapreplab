<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class VerifyUserEmailSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'heisembergtc@gmail.com')->first();
        
        if ($user) {
            $user->email_verified_at = now();
            $user->save();
            
            $this->command->info("✅ Email verificado para: {$user->name} ({$user->email})");
        } else {
            $this->command->error("❌ Usuario no encontrado con email: heisembergtc@gmail.com");
        }
    }
}
