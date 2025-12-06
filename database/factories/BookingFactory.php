<?php

namespace Database\Factories;

use App\BookingStatus;
use App\Models\Booking;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    protected $model = Booking::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $scheduledAt = fake()->dateTimeBetween('now', '+1 month');

        return [
            'user_id' => User::factory(),
            'service_id' => Service::factory(),
            'vehicle_type' => fake()->randomElement(['motor', 'mobil', 'salon']),
            'vehicle_plate' => fake()->bothify('??####??'),
            'scheduled_at' => $scheduledAt,
            'estimated_finish_at' => (clone $scheduledAt)->modify('+1 hour'),
            'status' => BookingStatus::Pending->value,
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
