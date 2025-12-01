<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('items', function (Blueprint $table) {
            // Agregar columna para almacenar el contenido de la pregunta en formato JSON
            $table->json('question_json')->nullable()->after('subtema_id');
            
            // Agregar columnas adicionales para compatibilidad con el sistema de bloques
            $table->string('explanation_visibility', 20)->default('public')->after('visibility');
            $table->string('paper_type', 20)->nullable()->after('explanation_visibility');
            $table->boolean('is_similar_only')->default(false)->after('paper_type');
        });
        
        // Modificar el enum de answer_key para soportar 4 opciones
        DB::statement("ALTER TABLE items MODIFY COLUMN answer_key ENUM('A','B','C','D') NOT NULL");
    }

    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropColumn(['question_json', 'explanation_visibility', 'paper_type', 'is_similar_only']);
        });
        
        // Revertir answer_key a 3 opciones
        DB::statement("ALTER TABLE items MODIFY COLUMN answer_key ENUM('A','B','C') NOT NULL");
    }
};
