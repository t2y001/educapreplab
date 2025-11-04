<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfesorController;
use App\Http\Controllers\SimulacroController;
use App\Http\Controllers\ProgresoController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\AdminInquiryController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Models\Area;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('home');

Route::get('/profesores', [ProfesorController::class, 'index'])->name('profesores.index');
Route::get('/profesores/{audienciaId}/{area:slug}', [ProfesorController::class, 'showArea'])
->whereNumber('audienciaId')
->name('profesores.area');

// Simulacros (módulo aparte)
Route::middleware('auth')->group(function(){
  Route::get('/simulacros', [SimulacroController::class, 'index'])->name('simulacros.index');
  Route::post('/simulacros/create', [SimulacroController::class, 'create'])->name('simulacros.create'); // arma instancia
  Route::get('/simulacros/{exam}', [SimulacroController::class, 'show'])->name('simulacros.show');
});

// Registro de respuesta (para adaptativo)
Route::post('/progreso/responder', [ProgresoController::class, 'store'])->name('progreso.responder');

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/suscripcion', [ProfesorController::class, 'subscriptionPage'])->name('subscription.page');

Route::get('register', function () {
    $areas = Area::where('audiencia_id',1)->get(['id','nombre']);

    return Inertia::render('Auth/Register', [
        'areas' => $areas,
        'canLogin' => Route::has('login')
    ]);
})->middleware('guest')->name('register');

// --- GRUPO DE RUTAS DE ADMINISTRADOR ---
// Verificar que tienes un Middleware 'isAdmin' o similar
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Ruta principal del admin de indagaciones (la lista)
    Route::get('/indagaciones', [AdminInquiryController::class, 'index'])
        ->name('inquiries.index');

    // Ruta para mostrar el formulario de creación
    Route::get('/indagaciones/crear', [AdminInquiryController::class, 'create'])
        ->name('inquiries.create');

    // Ruta para guardar la nueva indagación
    Route::post('/indagaciones', [AdminInquiryController::class, 'store'])
        ->name('inquiries.store');

    // Ruta para mostrar el formulario de edición
    Route::get('/indagaciones/{inquiry}/editar', [AdminInquiryController::class, 'edit'])
        ->name('inquiries.edit');

    // Ruta para actualizar una indagación existente
    Route::put('/indagaciones/{inquiry}', [AdminInquiryController::class, 'update'])
        ->name('inquiries.update');

    // Ruta para eliminar una indagación
    Route::delete('/indagaciones/{inquiry}', [AdminInquiryController::class, 'destroy'])
        ->name('inquiries.destroy');
});

require __DIR__.'/auth.php';
