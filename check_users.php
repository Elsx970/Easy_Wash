<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Booking;

$users = User::all();
echo "Total Users: " . $users->count() . "\n";
echo "Users:\n";
foreach ($users as $u) {
    $bookingCount = Booking::where('user_id', $u->id)->count();
    echo "- {$u->id}: {$u->name} ({$u->email}) - Role: {$u->role} - Bookings: {$bookingCount}\n";
}

echo "\nTotal Bookings: " . Booking::count() . "\n";
