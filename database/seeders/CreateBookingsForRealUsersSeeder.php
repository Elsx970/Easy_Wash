<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\User;
use App\Models\Service;
use App\Models\Location;
use Illuminate\Database\Seeder;

class CreateBookingsForRealUsersSeeder extends Seeder
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
            $this->command->error('Tidak ada location!');
            return;
        }

        $count = 0;
        foreach ($users as $user) {
            // Buat 2-3 bookings per user
            $numBookings = rand(2, 3);
            for ($i = 0; $i < $numBookings; $i++) {
                // Skip jika user sudah punya booking di hari ini
                $existingToday = Booking::where('user_id', $user->id)
                    ->whereDate('created_at', today())
                    ->count();

                if ($existingToday >= 3) {
                    continue;
                }

                Booking::create([
                    'user_id' => $user->id,
                    'location_id' => $location->id,
                    'service_id' => $services->random()->id,
                    'vehicle_type' => ['motor', 'mobil'][rand(0, 1)],
                    'vehicle_size' => 'sedang',
                    'vehicle_plate' => 'B ' . rand(1000, 9999) . ' ' . chr(rand(65, 90)) . chr(rand(65, 90)),
                    'scheduled_at' => now()->addDays(rand(0, 2))->setHour(rand(9, 16))->setMinute(0),
                    'estimated_finish_at' => now()->addDays(rand(0, 2))->setHour(rand(10, 17))->setMinute(0),
                    'status' => ['pending', 'in_progress', 'completed'][rand(0, 2)],
                    'booking_code' => Booking::generateBookingCode(),
                ]);
                $count++;
            }
        }

        $this->command->info("✅ Created {$count} bookings for real users!");
    }
}
