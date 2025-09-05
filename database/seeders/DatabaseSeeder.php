<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        User::factory()->create([
            'name' => 'Officer John Smith',
            'email' => 'officer@police.gov',
        ]);

        // Seed damage categories
        $this->call([
            DamageCategorySeeder::class,
        ]);

        // Create additional users
        User::factory(5)->create();

        // Create sample environmental reports
        \App\Models\EnvironmentalReport::factory(20)->create();
    }
}
