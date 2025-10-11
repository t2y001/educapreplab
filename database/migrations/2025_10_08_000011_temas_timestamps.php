<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('temas', function (Blueprint $table) {
            if (!Schema::hasColumn('temas', 'created_at')) {
                $table->timestamp('created_at')->nullable();
            }
            if (!Schema::hasColumn('temas', 'updated_at')) {
                $table->timestamp('updated_at')->nullable();
            }
        });

        if (Schema::hasColumn('temas', 'fecha_creacion')) {
            DB::statement('UPDATE temas SET created_at = fecha_creacion WHERE created_at IS NULL');
            Schema::table('temas', function (Blueprint $table) {
                $table->dropColumn('fecha_creacion');
            });
        }
    }

    public function down(): void
    {
        Schema::table('temas', function (Blueprint $table) {
            $table->dropColumn(['created_at', 'updated_at']);
        });
    }
};
