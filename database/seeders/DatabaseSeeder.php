<?php

namespace Database\Seeders;

use App\Models\Package;
use App\Models\Service;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use DragonCode\Support\Facades\Instances\Call;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin@admin.com',
            'password' => Hash::make('123'),
        ]);

        $service = Service::factory()->create([
            'name' => 'Photobox'
        ]);

        $service1 = Service::factory()->create([
            'name' => 'Selfphoto'
        ]);

        $serviceId = [$service, $service1];

        foreach (range(1, 10) as $index) {
            Package::factory()->create([
                'service_id' => $serviceId[array_rand($serviceId)],
                'name' => 'Paket '.$index,
                'price' => random_int(150000, 1000000),
                'description' => 'Paket Foto '. $index
            ]);
        }

    }
}
