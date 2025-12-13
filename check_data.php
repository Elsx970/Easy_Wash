<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Booking;
use App\Models\User;
use App\Models\Transaction;

echo "=== DATABASE CHECK ===\n\n";

$users = User::where('role', 'user')->get();
echo "Total Users: " . $users->count() . "\n";
foreach ($users as $u) {
    echo "- {$u->name} ({$u->email})\n";
}

echo "\n";

$bookings = Booking::with(['user', 'service', 'transaction', 'washStatus'])->get();
echo "Total Bookings: " . $bookings->count() . "\n\n";

foreach ($bookings as $b) {
    echo "Booking ID: {$b->id}\n";
    echo "  User: {$b->user->name}\n";
    echo "  Service: {$b->service->name}\n";
    echo "  Vehicle: {$b->vehicle_plate} ({$b->vehicle_type})\n";
    echo "  Status: {$b->status}\n";
    echo "  Transaction: Rp " . number_format($b->transaction->amount ?? 0, 0, ',', '.') . " ({$b->transaction->status})\n";
    echo "  Wash: {$b->washStatus->status} - {$b->washStatus->progress_percentage}%\n";
    echo "\n";
}

$transactions = Transaction::with('booking')->limit(5)->get();
echo "Recent Transactions:\n";
foreach ($transactions as $t) {
    echo "- TRX #{$t->id}: Rp " . number_format($t->amount, 0, ',', '.') . " ({$t->status})\n";
}
