<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('areas', function (Blueprint $table) {
            if (!Schema::hasColumn('areas', 'created_at')) {
                $table->timestamp('created_at')->nullable();
            }
            if (!Schema::hasColumn('areas', 'updated_at')) {
                $table->timestamp('updated_at')->nullable();
            }
        });

        // Si venías de 'fecha_creacion', migra datos (no falla si no existe)
        if (Schema::hasColumn('areas', 'fecha_creacion')) {
            DB::statement('UPDATE areas SET created_at = fecha_creacion WHERE created_at IS NULL');
            Schema::table('areas', function (Blueprint $table) {
                $table->dropColumn('fecha_creacion');
            });
        }

        // Unicidad compuesta
        Schema::table('areas', function (Blueprint $table) {
            $table->unique(['audiencia_id', 'slug'], 'areas_audiencia_slug_unique');
        });
    }

    public function down(): void
    {
        Schema::table('areas', function (Blueprint $table) {
            $table->dropUnique('areas_audiencia_slug_unique');
            $table->dropColumn(['created_at', 'updated_at']);
        });
    }
};
