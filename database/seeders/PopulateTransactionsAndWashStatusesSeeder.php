<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Transaction;
use App\Models\WashStatus;
use Illuminate\Database\Seeder;

class PopulateTransactionsAndWashStatusesSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Get all bookings yang belum memiliki transaction dan wash status
        $bookings = Booking::with('service')->get();

        foreach ($bookings as $booking) {
            // Create transaction jika belum ada
            if (!$booking->transaction) {
                $service = $booking->service;
                $amount = $service ? $service->price : 50000;

                Transaction::create([
                    'booking_id' => $booking->id,
                    'amount' => $amount,
                    'payment_method' => ['cash', 'transfer', 'card'][rand(0, 2)],
                    'status' => $booking->status === 'completed' ? 'completed' : 'pending',
                    'payment_reference' => 'TRX-' . str_pad($booking->id, 5, '0', STR_PAD_LEFT),
                    'notes' => null,
                ]);
            }

            // Create wash status jika belum ada
            if (!$booking->washStatus) {
                $statusMap = [
                    'pending' => ['status' => 'waiting', 'progress' => 0],
                    'in_progress' => ['status' => 'washing', 'progress' => rand(30, 80)],
                    'completed' => ['status' => 'completed', 'progress' => 100],
                    'cancelled' => ['status' => 'completed', 'progress' => 0],
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

        $this->command->info('✅ Transactions dan Wash Statuses created/updated successfully!');
    }
}
