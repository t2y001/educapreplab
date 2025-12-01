<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('choices', function (Blueprint $table) {
            // Renombrar 'label' a 'letter'
            $table->renameColumn('label', 'letter');
        });
        
        // Modificar el enum para incluir 'D' y cambiar el tipo a VARCHAR
        DB::statement("ALTER TABLE `choices` MODIFY `letter` VARCHAR(1) NOT NULL");
        
        // Agregar columna order_index si no existe
        if (!Schema::hasColumn('choices', 'order_index')) {
            Schema::table('choices', function (Blueprint $table) {
                $table->integer('order_index')->default(0)->after('letter');
            });
        }
        
        // Actualizar el índice único
        Schema::table('choices', function (Blueprint $table) {
            $table->dropUnique('choices_item_label_unique');
            $table->unique(['item_id', 'letter'], 'choices_item_letter_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('choices', function (Blueprint $table) {
            $table->dropUnique('choices_item_letter_unique');
            $table->unique(['item_id', 'label'], 'choices_item_label_unique');
        });
        
        if (Schema::hasColumn('choices', 'order_index')) {
            Schema::table('choices', function (Blueprint $table) {
                $table->dropColumn('order_index');
            });
        }
        
        DB::statement("ALTER TABLE `choices` MODIFY `letter` ENUM('A','B','C') NOT NULL");
        
        Schema::table('choices', function (Blueprint $table) {
            $table->renameColumn('letter', 'label');
        });
    }
};
