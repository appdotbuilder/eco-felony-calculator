<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DamageCategory>
 */
class DamageCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            ['name' => 'Water Pollution', 'unit' => 'cubic_meter', 'cost' => 150.00],
            ['name' => 'Soil Contamination', 'unit' => 'sqm', 'cost' => 200.00],
            ['name' => 'Air Pollution', 'unit' => 'cubic_meter', 'cost' => 100.00],
            ['name' => 'Wildlife Impact', 'unit' => 'animal', 'cost' => 500.00],
            ['name' => 'Vegetation Damage', 'unit' => 'sqm', 'cost' => 75.00],
            ['name' => 'Noise Pollution', 'unit' => 'sqm', 'cost' => 25.00],
        ];

        $category = fake()->randomElement($categories);

        return [
            'name' => $category['name'],
            'description' => fake()->paragraph(),
            'base_cost_per_unit' => $category['cost'],
            'unit_type' => $category['unit'],
            'severity_multiplier' => fake()->randomFloat(2, 0.8, 2.0),
            'active' => fake()->boolean(90),
        ];
    }

    /**
     * Indicate that the category is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'active' => false,
        ]);
    }

    /**
     * Indicate that the category has high cost.
     */
    public function highCost(): static
    {
        return $this->state(fn (array $attributes) => [
            'base_cost_per_unit' => fake()->randomFloat(2, 1000, 5000),
            'severity_multiplier' => fake()->randomFloat(2, 2.0, 5.0),
        ]);
    }
}