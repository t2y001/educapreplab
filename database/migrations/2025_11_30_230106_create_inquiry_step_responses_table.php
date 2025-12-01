<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiry_step_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('inquiry_id')->constrained()->onDelete('cascade');
            $table->foreignId('inquiry_step_id')->constrained()->onDelete('cascade');
            $table->foreignId('inquiry_step_option_id')->nullable()->constrained()->onDelete('set null');
            $table->json('response_data'); // Respuesta completa
            $table->boolean('is_correct')->nullable();
            $table->integer('attempts')->default(1);
            $table->integer('time_spent')->default(0); // segundos
            $table->timestamps();
            
            $table->index(['user_id', 'inquiry_id']);
            $table->index(['inquiry_step_id', 'is_correct']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiry_step_responses');
    }
};
