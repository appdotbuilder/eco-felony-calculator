<?php

namespace Database\Factories;

use App\Models\DamageCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EnvironmentalReport>
 */
class EnvironmentalReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $severityLevels = ['low', 'medium', 'high', 'critical'];
        $statuses = ['draft', 'submitted', 'reviewed', 'closed'];
        
        return [
            'case_number' => fake()->unique()->regexify('ENV-[0-9]{6}-[0-9]{4}'),
            'user_id' => User::factory(),
            'damage_category_id' => DamageCategory::factory(),
            'location' => fake()->address(),
            'latitude' => fake()->latitude(),
            'longitude' => fake()->longitude(),
            'affected_area' => fake()->randomFloat(2, 100, 10000),
            'pollutant_volume' => fake()->randomFloat(2, 10, 1000),
            'affected_animals' => fake()->numberBetween(0, 500),
            'severity_level' => fake()->randomElement($severityLevels),
            'calculated_damage' => fake()->randomFloat(2, 1000, 100000),
            'ecological_data' => [
                'protected_area' => fake()->boolean(30),
                'ecosystem_type' => fake()->randomElement(['forest', 'wetland', 'marine', 'urban', 'agricultural']),
                'biodiversity_level' => fake()->randomElement(['low', 'medium', 'high']),
            ],
            'notes' => fake()->optional()->paragraph(),
            'ai_analysis' => null, // Placeholder for future AI integration
            'status' => fake()->randomElement($statuses),
        ];
    }

    /**
     * Indicate that the report is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
        ]);
    }

    /**
     * Indicate that the report is critical severity.
     */
    public function critical(): static
    {
        return $this->state(fn (array $attributes) => [
            'severity_level' => 'critical',
            'calculated_damage' => fake()->randomFloat(2, 50000, 500000),
        ]);
    }

    /**
     * Indicate that the report involves a protected area.
     */
    public function protectedArea(): static
    {
        return $this->state(fn (array $attributes) => [
            'ecological_data' => array_merge($attributes['ecological_data'] ?? [], [
                'protected_area' => true,
                'protection_status' => fake()->randomElement(['National Park', 'Wildlife Reserve', 'Marine Sanctuary']),
            ]),
        ]);
    }
}