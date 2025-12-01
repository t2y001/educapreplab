<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiry_step_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inquiry_step_id')->constrained()->onDelete('cascade');
            $table->string('option_label', 10); // A, B, C, D, etc.
            $table->text('option_text');
            $table->boolean('is_correct')->default(false);
            $table->text('feedback')->nullable();
            $table->integer('order')->default(1);
            $table->timestamps();
            
            $table->index(['inquiry_step_id', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiry_step_options');
    }
};
