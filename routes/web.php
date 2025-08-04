<?php

use App\Http\Controllers\PackageController;
use App\Http\Controllers\ServiceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('master-data/services', ServiceController::class)->except('create','show', 'edit');
    Route::resource('master-data/package', PackageController::class)->except('create','show', 'edit');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
