<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'amount' => $this->faker->numberBetween(25000, 300000),
            'payment_method' => $this->faker->randomElement(['cash', 'transfer', 'card']),
            'status' => $this->faker->randomElement(['pending', 'completed', 'failed']),
            'payment_reference' => $this->faker->optional(0.7)->bothify('TRX-####-????'),
            'notes' => $this->faker->optional(0.3)->sentence(),
        ];
    }
}
