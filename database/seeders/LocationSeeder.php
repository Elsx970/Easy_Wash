<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Location::query()->delete();

        Location::create([
            'name' => 'Lokasi Bandung',
            'address' => 'Jl. Pasteur No. 123, Bandung, Jawa Barat',
            'phone' => '(0274) 512345',
            'operating_hours' => 'Senin - Minggu 08.00 - 17.00',
            'latitude' => -6.9175,
            'longitude' => 107.6107,
            'is_active' => true,
        ]);

        Location::create([
            'name' => 'Lokasi Jakarta',
            'address' => 'Jl. Merdeka No. 456, Jakarta Pusat, DKI Jakarta',
            'phone' => '(021) 654321',
            'operating_hours' => 'Senin - Minggu 07.00 - 19.00',
            'latitude' => -6.2088,
            'longitude' => 106.8456,
            'is_active' => true,
        ]);

        Location::create([
            'name' => 'Lokasi Surabaya',
            'address' => 'Jl. Ahmad Yani No. 789, Surabaya, Jawa Timur',
            'phone' => '(031) 987654',
            'operating_hours' => 'Senin - Minggu 08.00 - 18.00',
            'latitude' => -7.2504,
            'longitude' => 112.7508,
            'is_active' => true,
        ]);

        Location::create([
            'name' => 'Lokasi Medan',
            'address' => 'Jl. Diponegoro No. 321, Medan, Sumatera Utara',
            'phone' => '(061) 456789',
            'operating_hours' => 'Senin - Minggu 08.00 - 17.00',
            'latitude' => 3.1957,
            'longitude' => 98.6722,
            'is_active' => true,
        ]);
    }
}
