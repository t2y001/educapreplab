<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('profesor_asignaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->integer('area_id')->nullable();
            $table->integer('audiencia_id')->nullable();
            $table->enum('rol', ['lider', 'colaborador'])->default('colaborador');
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('area_id')->references('id')->on('areas')->onDelete('cascade');
            $table->foreign('audiencia_id')->references('id')->on('audiencias')->onDelete('cascade');
            
            // Unique constraint: un profesor no puede tener la misma asignación duplicada
            $table->unique(['user_id', 'area_id', 'audiencia_id'], 'uk_user_area_audiencia');
            
            // Indexes
            $table->index(['user_id', 'rol']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profesor_asignaciones');
    }
};
