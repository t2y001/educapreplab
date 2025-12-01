<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiry_step_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inquiry_id')->constrained()->onDelete('cascade');
            $table->foreignId('inquiry_step_id')->constrained()->onDelete('cascade');
            $table->integer('total_attempts')->default(0);
            $table->integer('total_completions')->default(0);
            $table->decimal('success_rate', 5, 2)->default(0); // Porcentaje
            $table->integer('avg_time_spent')->default(0); // segundos
            $table->integer('avg_attempts')->default(0);
            $table->json('common_errors')->nullable(); // Top errores
            $table->json('performance_by_day')->nullable(); // Datos históricos
            $table->timestamp('last_calculated_at')->nullable();
            $table->timestamps();
            
            $table->unique(['inquiry_id', 'inquiry_step_id']);
            $table->index('success_rate');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiry_step_stats');
    }
};
