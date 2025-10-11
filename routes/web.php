<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfesorController;
use App\Http\Controllers\SimulacroController;
use App\Http\Controllers\ProgresoController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
