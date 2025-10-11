<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::dropIfExists('usuario_audiencia');
        Schema::dropIfExists('usuario_suscripcion');
        Schema::dropIfExists('tokens_verificacion');
        Schema::dropIfExists('suscripciones');
        Schema::dropIfExists('usuarios');
    }

    public function down(): void
    {
        // Intencionalmente vacío (tablas eliminadas).
    }
};
