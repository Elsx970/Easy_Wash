<?php

use App\Http\Controllers\Api\ApiAuthController;
use App\Http\Controllers\Api\ApiBookingController;
use App\Http\Controllers\Api\ApiLocationController;
use App\Http\Controllers\Api\ApiServiceController;
use App\Http\Controllers\AdminManagementController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication routes (with session middleware)
Route::middleware(['web'])->group(function () {
    Route::post('register', [ApiAuthController::class, 'register'])->name('api.register');
    Route::post('login', [ApiAuthController::class, 'login'])->name('api.login');
    Route::post('logout', [ApiAuthController::class, 'logout'])->middleware('auth')->name('api.logout');
    Route::get('user', [ApiAuthController::class, 'user'])->middleware('auth')->name('api.user');
});

// API v1 routes
Route::prefix('v1')->name('api.v1.')->group(function () {
    // Public routes
    Route::get('services', [ApiServiceController::class, 'index'])->name('services.index');
    Route::get('services/{service}', [ApiServiceController::class, 'show'])->name('services.show');
    Route::get('locations', [ApiLocationController::class, 'index'])->name('locations.index');
    Route::get('locations/{location}', [ApiLocationController::class, 'show'])->name('locations.show');

    // Protected routes
    Route::middleware(['auth'])->group(function () {
        // Booking routes
        Route::apiResource('bookings', ApiBookingController::class)->names('bookings');
        Route::get('bookings/queue/live', [ApiBookingController::class, 'queue'])->name('bookings.queue');

        // Service management routes (admin only)
        Route::middleware('admin')->group(function () {
            Route::post('services', [ApiServiceController::class, 'store'])->name('services.store');
            Route::put('services/{service}', [ApiServiceController::class, 'update'])->name('services.update');
            Route::patch('services/{service}', [ApiServiceController::class, 'update'])->name('services.patch');
            Route::delete('services/{service}', [ApiServiceController::class, 'destroy'])->name('services.destroy');
        });
    });
});

// Admin management routes (admin only)
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::delete('users/{id}', [AdminManagementController::class, 'deleteUser'])->name('users.destroy');
    Route::put('wash-status/{id}', [AdminManagementController::class, 'updateWashStatus'])->name('wash-status.update');
    Route::put('transactions/{id}', [AdminManagementController::class, 'updateTransactionStatus'])->name('transactions.update');
});
