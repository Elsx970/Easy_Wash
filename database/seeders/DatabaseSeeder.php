<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::firstOrCreate(
            ['email' => 'admin@easywash.com'],
            [
                'name' => 'Admin EasyWash',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Create sample services
        Service::firstOrCreate(
            ['name' => 'Cuci Motor Standar'],
            [
                'description' => 'Cuci motor dengan paket standar',
                'duration_minutes' => 30,
                'price' => 25000,
            ]
        );

        Service::firstOrCreate(
            ['name' => 'Cuci Motor Premium'],
            [
                'description' => 'Cuci motor dengan paket premium termasuk wax',
                'duration_minutes' => 60,
                'price' => 50000,
            ]
        );

        Service::firstOrCreate(
            ['name' => 'Cuci Mobil Standar'],
            [
                'description' => 'Cuci mobil dengan paket standar',
                'duration_minutes' => 60,
                'price' => 75000,
            ]
        );

        Service::firstOrCreate(
            ['name' => 'Cuci Mobil Premium'],
            [
                'description' => 'Cuci mobil dengan paket premium termasuk wax dan vacuum',
                'duration_minutes' => 120,
                'price' => 150000,
            ]
        );

        Service::firstOrCreate(
            ['name' => 'Cuci Express'],
            [
                'description' => 'Paket express untuk cuci cepat hanya bagian luar',
                'duration_minutes' => 30,
                'price' => 50000,
            ]
        );

        Service::firstOrCreate(
            ['name' => 'Salon Mobil'],
            [
                'description' => 'Paket lengkap salon mobil termasuk detailing',
                'duration_minutes' => 180,
                'price' => 300000,
            ]
        );

        // Create sample locations (based on Figma design)
        Location::firstOrCreate(
            ['name' => 'Kedaton'],
            [
                'address' => 'Jl. Melati Indah No. 27, Kedaton, Kota Bandar Lampung, Lampung 3514',
                'phone' => '+62 813-1548-8727',
                'operating_hours' => 'Senin - Minggu 08.00 - 17.00',
                'is_active' => true,
            ]
        );

        Location::firstOrCreate(
            ['name' => 'Way Halim'],
            [
                'address' => 'Jl. Pangeran Antasari No. 88, Way Halim Permai, Kota Bandar Lampung, Lampung 35133',
                'phone' => '+62 882-3230-8327',
                'operating_hours' => 'Senin - Minggu 08.00 - 17.00',
                'is_active' => true,
            ]
        );

        Location::firstOrCreate(
            ['name' => 'Antasari'],
            [
                'address' => 'Jl. Sultan Agung No. 105, Tanjung Agung Raya, Kota Bandar Lampung, Lampung 35112',
                'phone' => '+62 812-2553-3722',
                'operating_hours' => 'Senin - Minggu 08.00 - 17.00',
                'is_active' => true,
            ]
        );
    }
}
