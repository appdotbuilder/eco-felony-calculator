<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DamageCategory;

class CalculatorController extends Controller
{
    /**
     * Calculate environmental damage based on parameters.
     */
    public function store()
    {
        $request = request();
        $request->validate([
            'damage_category_id' => 'required|exists:damage_categories,id',
            'affected_area' => 'nullable|numeric|min:0',
            'pollutant_volume' => 'nullable|numeric|min:0',
            'affected_animals' => 'nullable|integer|min:0',
            'severity_level' => 'required|in:low,medium,high,critical',
        ]);

        $category = DamageCategory::find($request->damage_category_id);
        
        $severityMultiplier = match ($request->severity_level) {
            'low' => 0.5,
            'medium' => 1.0,
            'high' => 2.0,
            'critical' => 5.0,
            default => 1.0,
        };

        $unitValue = match ($category->unit_type) {
            'sqm' => $request->affected_area ?? 0,
            'cubic_meter' => $request->pollutant_volume ?? 0,
            'animal' => $request->affected_animals ?? 0,
            default => 1,
        };

        $calculatedDamage = $category->base_cost_per_unit * $unitValue * $severityMultiplier * $category->severity_multiplier;

        return response()->json([
            'success' => true,
            'calculated_damage' => number_format($calculatedDamage, 2),
            'breakdown' => [
                'base_cost' => $category->base_cost_per_unit,
                'unit_value' => $unitValue,
                'unit_type' => $category->unit_type,
                'severity_multiplier' => $severityMultiplier,
                'category_multiplier' => $category->severity_multiplier,
                'total' => $calculatedDamage,
            ]
        ]);
    }
}