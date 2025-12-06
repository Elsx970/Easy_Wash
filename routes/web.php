<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ServiceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Public routes
Route::get('locations', [LocationController::class, 'index'])->name('locations.index');
Route::get('locations/{location}', [LocationController::class, 'show'])->name('locations.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Booking routes (accessible by all authenticated users)
    Route::resource('bookings', BookingController::class);
    Route::get('bookings/queue/live', [BookingController::class, 'queue'])->name('bookings.queue');

    // Invoice routes
    Route::get('bookings/{booking}/invoice', [InvoiceController::class, 'show'])->name('bookings.invoice');
    Route::get('bookings/{booking}/invoice/download', [InvoiceController::class, 'download'])->name('bookings.invoice.download');

    // Service routes (admin only)
    Route::middleware('admin')->group(function () {
        Route::resource('services', ServiceController::class);
    });
});

require __DIR__.'/settings.php';
