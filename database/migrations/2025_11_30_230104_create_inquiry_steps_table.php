<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiry_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inquiry_id')->constrained()->onDelete('cascade');
            $table->integer('order')->default(1);
            $table->enum('step_type', [
                'problem',
                'hypothesis', 
                'experiment',
                'data_record',
                'analysis',
                'multiple_choice',
                'open_question',
                'custom'
            ]);
            $table->string('title');
            $table->json('content')->nullable(); // Contenido específico del paso
            $table->json('simulator_config')->nullable(); // Configuración del simulador
            $table->integer('xp_reward')->default(0);
            $table->boolean('is_required')->default(true);
            $table->timestamps();
            
            $table->index(['inquiry_id', 'order']);
            $table->index('step_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiry_steps');
    }
};
