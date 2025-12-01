<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_inquiry_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('inquiry_id')->constrained()->onDelete('cascade');
            $table->integer('current_step')->default(1);
            $table->json('data')->nullable();
            $table->boolean('completed')->default(false);
            $table->integer('score')->nullable();
            $table->integer('time_spent')->default(0);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'inquiry_id']);
            $table->index(['user_id', 'completed']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_inquiry_progress');
    }
};
