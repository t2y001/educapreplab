<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('simulator_interactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('inquiry_id')->constrained()->onDelete('cascade');
            $table->foreignId('inquiry_step_id')->constrained()->onDelete('cascade');
            $table->enum('interaction_type', [
                'parameter_change',
                'experiment_run',
                'data_capture',
                'reset',
                'other'
            ]);
            $table->json('interaction_data'); // Datos específicos de la interacción
            $table->timestamp('created_at');
            
            $table->index(['user_id', 'inquiry_id']);
            $table->index(['inquiry_step_id', 'interaction_type']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('simulator_interactions');
    }
};
