<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\User;
use App\Models\Service;
use App\Models\Location;
use App\Models\Transaction;
use App\Models\WashStatus;
use Illuminate\Database\Seeder;

class CreateSampleBookingsSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = User::where('role', 'user')->get();
        $services = Service::all();
        $location = Location::first();

        if (!$location) {
            $this->command->error('Tidak ada location! Jalankan seeder DatabaseSeeder dulu.');
            return;
        }

        foreach ($users as $user) {
            for ($i = 0; $i < 3; $i++) {
                $booking = Booking::create([
                    'user_id' => $user->id,
                    'location_id' => $location->id,
                    'service_id' => $services->random()->id,
                    'vehicle_type' => ['motor', 'mobil', 'mobil_besar'][rand(0, 2)],
                    'vehicle_size' => ['kecil', 'sedang', 'besar'][rand(0, 2)],
                    'vehicle_plate' => 'B ' . rand(1000, 9999) . ' ' . chr(rand(65, 90)) . chr(rand(65, 90)),
                    'scheduled_at' => now()->addDays(rand(0, 3))->setHour(rand(8, 16))->setMinute(0),
                    'estimated_finish_at' => now()->addDays(rand(0, 3))->setHour(rand(9, 17))->setMinute(0),
                    'status' => ['pending', 'in_progress', 'completed'][rand(0, 2)],
                    'booking_code' => Booking::generateBookingCode(),
                ]);

                // Create transaction for booking
                Transaction::create([
                    'booking_id' => $booking->id,
                    'amount' => $booking->service()->first()?->price ?? 50000,
                    'payment_method' => ['cash', 'transfer', 'card'][rand(0, 2)],
                    'status' => $booking->status === 'completed' ? 'completed' : 'pending',
                    'payment_reference' => 'TRX-' . str_pad($booking->id, 5, '0', STR_PAD_LEFT),
                ]);

                // Create wash status for booking
                $statusMap = [
                    'pending' => ['status' => 'waiting', 'progress' => 0],
                    'in_progress' => ['status' => 'washing', 'progress' => rand(30, 80)],
                    'completed' => ['status' => 'completed', 'progress' => 100],
                ];

                $mapped = $statusMap[$booking->status] ?? ['status' => 'waiting', 'progress' => 0];

                WashStatus::create([
                    'booking_id' => $booking->id,
                    'status' => $mapped['status'],
                    'progress_percentage' => $mapped['progress'],
                    'notes' => 'Proses cuci sedang berlangsung',
                ]);
            }
        }

        $this->command->info('✅ Sample bookings, transactions, dan wash statuses created successfully!');
    }
}
