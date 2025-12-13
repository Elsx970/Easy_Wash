<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WashStatus>
 */
class WashStatusFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'status' => $this->faker->randomElement(['waiting', 'washing', 'drying', 'quality_check', 'completed']),
            'progress_percentage' => $this->faker->numberBetween(0, 100),
            'notes' => $this->faker->optional(0.4)->sentence(),
        ];
    }
}
