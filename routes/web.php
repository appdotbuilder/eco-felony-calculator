<?php

use App\Http\Controllers\CalculatorController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EcologicalDataController;
use App\Http\Controllers\EnvironmentalReportController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page with environmental damage calculator
Route::get('/', [DashboardController::class, 'index'])->name('home');

// API endpoint for damage calculation
Route::post('/calculate-damage', [CalculatorController::class, 'store'])->name('calculate.damage');

// API endpoint for ecological data
Route::post('/ecological-data', [EcologicalDataController::class, 'store'])->name('ecological.data');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Environmental reports
    Route::resource('environmental-reports', EnvironmentalReportController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
