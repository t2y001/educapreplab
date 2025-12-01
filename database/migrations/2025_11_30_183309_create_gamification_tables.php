<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabla principal de gamificación por usuario
        Schema::create('user_gamification', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('level')->default(1);
            $table->integer('xp')->default(0); // XP actual en el nivel
            $table->integer('total_xp')->default(0); // XP acumulado total
            $table->string('scientist_title', 100)->default('Aprendiz Curioso');
            $table->integer('current_streak')->default(0);
            $table->integer('longest_streak')->default(0);
            $table->date('last_activity_date')->nullable();
            $table->timestamps();
            
            $table->unique('user_id');
            $table->index(['level', 'total_xp']);
        });

        // Catálogo de logros disponibles
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique();
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->enum('category', ['inquiry', 'consistency', 'mastery', 'collaboration', 'special']);
            $table->string('icon', 50)->nullable();
            $table->integer('xp_reward')->default(0);
            $table->enum('rarity', ['common', 'rare', 'epic', 'legendary'])->default('common');
            $table->json('criteria')->nullable(); // Condiciones para desbloquear
            $table->boolean('is_secret')->default(false);
            $table->timestamps();
            
            $table->index('category');
            $table->index('rarity');
        });

        // Logros desbloqueados por usuario
        Schema::create('user_achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('achievement_id')->constrained()->onDelete('cascade');
            $table->integer('progress')->default(0); // Para logros progresivos
            $table->boolean('completed')->default(false);
            $table->timestamp('unlocked_at')->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'achievement_id']);
            $table->index(['user_id', 'completed']);
        });

        // Historial de transacciones de XP
        Schema::create('xp_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('amount'); // Puede ser negativo
            $table->string('action_type', 50); // 'inquiry_completed', 'hypothesis_correct', etc.
            $table->string('reference_type', 50)->nullable(); // 'Inquiry', 'Item', etc.
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->string('description', 255)->nullable();
            $table->timestamp('created_at');
            
            $table->index(['user_id', 'created_at']);
            $table->index('action_type');
        });

        // Personalización del usuario
        Schema::create('user_customization', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('avatar_id')->default(1);
            $table->integer('lab_theme_id')->default(1);
            $table->string('title_display', 100)->nullable();
            $table->json('preferences')->nullable(); // Configuraciones adicionales
            $table->timestamps();
            
            $table->unique('user_id');
        });

        // Leaderboards (rankings)
        Schema::create('leaderboard_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('period', ['weekly', 'monthly', 'all_time'])->default('all_time');
            $table->enum('scope', ['global', 'class', 'school', 'region'])->default('global');
            $table->unsignedBigInteger('scope_id')->nullable(); // ID de clase, escuela, etc.
            $table->integer('rank')->default(0);
            $table->integer('score')->default(0); // Puede ser XP, indagaciones, etc.
            $table->date('period_start')->nullable();
            $table->date('period_end')->nullable();
            $table->timestamps();
            
            $table->index(['period', 'scope', 'rank']);
            $table->index(['user_id', 'period', 'scope']);
        });

        // Racha diaria (streak tracking)
        Schema::create('user_streaks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('activity_date');
            $table->integer('inquiries_completed')->default(0);
            $table->integer('xp_earned')->default(0);
            $table->boolean('streak_maintained')->default(true);
            $table->timestamps();
            
            $table->unique(['user_id', 'activity_date']);
            $table->index(['user_id', 'activity_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_streaks');
        Schema::dropIfExists('leaderboard_entries');
        Schema::dropIfExists('user_customization');
        Schema::dropIfExists('xp_transactions');
        Schema::dropIfExists('user_achievements');
        Schema::dropIfExists('achievements');
        Schema::dropIfExists('user_gamification');
    }
};
