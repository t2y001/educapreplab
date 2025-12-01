<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiry_assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inquiry_id')->constrained()->onDelete('cascade');
            $table->foreignId('inquiry_step_id')->nullable()->constrained()->onDelete('cascade');
            $table->enum('asset_type', ['image', 'video', 'audio', 'document', 'other']);
            $table->string('asset_path'); // Ruta relativa
            $table->string('asset_url')->nullable(); // URL completa si está en CDN
            $table->string('filename');
            $table->string('mime_type')->nullable();
            $table->integer('file_size')->nullable(); // bytes
            $table->text('description')->nullable();
            $table->integer('order')->default(1);
            $table->timestamps();
            
            $table->index(['inquiry_id', 'asset_type']);
            $table->index('inquiry_step_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiry_assets');
    }
};
