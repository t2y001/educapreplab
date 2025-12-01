<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('audiencias', function (Blueprint $table) {
            // Número de alternativas que usa esta audiencia (3 o 4)
            $table->tinyInteger('num_alternatives')->default(3);
        });
        
        // Actualizar audiencias existentes
        DB::table('audiencias')->update(['num_alternatives' => 3]); // MINEDU usa 3
    }

    public function down(): void
    {
        Schema::table('audiencias', function (Blueprint $table) {
            $table->dropColumn('num_alternatives');
        });
    }
};
