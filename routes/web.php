<?php

use App\Http\Controllers\LandingController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TempUploadController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [LandingController::class, 'home'])->name('home');


Route::middleware(['auth'])->group(callback: function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    Route::resource('studio/services', ServiceController::class)->except('create','show', 'edit');
    Route::resource('studio/packages', PackageController::class)->except('create','show', 'edit');

    Route::post('/uploads', [TempUploadController::class, 'store'])->name('upload.temp');
    Route::delete('/reverts', [TempUploadController::class, 'revert'])->name('revert.temp');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
