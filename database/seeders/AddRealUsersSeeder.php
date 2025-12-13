<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AddRealUsersSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create real users
        User::firstOrCreate(
            ['email' => 'abelianz9000@gmail.com'],
            [
                'name' => 'Lian',
                'password' => Hash::make('password'),
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'ghilflywithme@gmail.com'],
            [
                'name' => 'Abel',
                'password' => Hash::make('password'),
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('✅ Real users created successfully!');
    }
}
