<?php

namespace Database\Seeders;

use App\Models\DamageCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DamageCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Water Pollution',
                'description' => 'Contamination of water bodies including rivers, lakes, groundwater, and marine environments',
                'base_cost_per_unit' => 150.00,
                'unit_type' => 'cubic_meter',
                'severity_multiplier' => 1.5,
            ],
            [
                'name' => 'Soil Contamination',
                'description' => 'Chemical contamination of soil affecting agricultural land, residential areas, and natural habitats',
                'base_cost_per_unit' => 200.00,
                'unit_type' => 'sqm',
                'severity_multiplier' => 2.0,
            ],
            [
                'name' => 'Air Pollution',
                'description' => 'Release of harmful substances into the atmosphere affecting air quality and public health',
                'base_cost_per_unit' => 100.00,
                'unit_type' => 'cubic_meter',
                'severity_multiplier' => 1.2,
            ],
            [
                'name' => 'Wildlife Impact',
                'description' => 'Direct harm to wildlife including injury, death, or habitat destruction affecting animal populations',
                'base_cost_per_unit' => 500.00,
                'unit_type' => 'animal',
                'severity_multiplier' => 3.0,
            ],
            [
                'name' => 'Vegetation Damage',
                'description' => 'Destruction or contamination of plant life including forests, crops, and natural vegetation',
                'base_cost_per_unit' => 75.00,
                'unit_type' => 'sqm',
                'severity_multiplier' => 1.3,
            ],
            [
                'name' => 'Noise Pollution',
                'description' => 'Excessive noise affecting wildlife behavior, human health, and ecosystem balance',
                'base_cost_per_unit' => 25.00,
                'unit_type' => 'sqm',
                'severity_multiplier' => 0.8,
            ],
            [
                'name' => 'Waste Dumping',
                'description' => 'Illegal disposal of hazardous or non-hazardous waste in unauthorized locations',
                'base_cost_per_unit' => 300.00,
                'unit_type' => 'cubic_meter',
                'severity_multiplier' => 2.5,
            ],
            [
                'name' => 'Chemical Spill',
                'description' => 'Accidental or intentional release of toxic chemicals into the environment',
                'base_cost_per_unit' => 800.00,
                'unit_type' => 'cubic_meter',
                'severity_multiplier' => 4.0,
            ],
        ];

        foreach ($categories as $category) {
            DamageCategory::create($category);
        }
    }
}