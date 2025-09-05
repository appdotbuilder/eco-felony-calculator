<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\EnvironmentalReport
 *
 * @property int $id
 * @property string $case_number
 * @property int $user_id
 * @property int $damage_category_id
 * @property string $location
 * @property float|null $latitude
 * @property float|null $longitude
 * @property float|null $affected_area
 * @property float|null $pollutant_volume
 * @property int|null $affected_animals
 * @property string $severity_level
 * @property float $calculated_damage
 * @property array|null $ecological_data
 * @property string|null $notes
 * @property array|null $ai_analysis
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\DamageCategory|null $damageCategory
 * @property-read \App\Models\User $user
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|EnvironmentalReport newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|EnvironmentalReport newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|EnvironmentalReport query()
 * @method static \Illuminate\Database\Eloquent\Builder|EnvironmentalReport whereAffectedAnimals($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EnvironmentalReport whereAffectedArea($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EnvironmentalReport whereAiAnalysis($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EnvironmentalReport whereCalculatedDamage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EnvironmentalReport whereCaseNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EnvironmentalReport whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EnvironmentalReport whereDamageCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EnvironmentalReport whereEcologicalData($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EnvironmentalReport whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EnvironmentalReport whereLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EnvironmentalReport whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EnvironmentalReport whereLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EnvironmentalReport whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EnvironmentalReport wherePollutantVolume($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EnvironmentalReport whereSeverityLevel($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EnvironmentalReport whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EnvironmentalReport whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|EnvironmentalReport whereUserId($value)
 * @method static \Database\Factories\EnvironmentalReportFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class EnvironmentalReport extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'case_number',
        'user_id',
        'damage_category_id',
        'location',
        'latitude',
        'longitude',
        'affected_area',
        'pollutant_volume',
        'affected_animals',
        'severity_level',
        'calculated_damage',
        'ecological_data',
        'notes',
        'ai_analysis',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'affected_area' => 'decimal:2',
        'pollutant_volume' => 'decimal:2',
        'affected_animals' => 'integer',
        'calculated_damage' => 'decimal:2',
        'ecological_data' => 'array',
        'ai_analysis' => 'array',
    ];

    /**
     * Get the user who created this report.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the damage category for this report.
     */
    public function damageCategory(): BelongsTo
    {
        return $this->belongsTo(DamageCategory::class);
    }

    /**
     * Generate a unique case number.
     */
    public static function generateCaseNumber(): string
    {
        $year = date('Y');
        $month = date('m');
        $count = static::whereYear('created_at', $year)
                      ->whereMonth('created_at', $month)
                      ->count() + 1;
        
        return sprintf('ENV-%s%s-%04d', $year, $month, $count);
    }

    /**
     * Calculate damage based on parameters.
     */
    public function calculateDamage(): float
    {
        $category = $this->damageCategory;
        if (!$category) {
            return 0.0;
        }

        $baseCost = $category->base_cost_per_unit;
        $severityMultiplier = match ($this->severity_level) {
            'low' => 0.5,
            'medium' => 1.0,
            'high' => 2.0,
            'critical' => 5.0,
            default => 1.0,
        };

        // Calculate based on unit type
        $unitValue = match ($category->unit_type) {
            'sqm' => $this->affected_area ?? 0,
            'cubic_meter' => $this->pollutant_volume ?? 0,
            'animal' => $this->affected_animals ?? 0,
            default => 1,
        };

        return $baseCost * $unitValue * $severityMultiplier * $category->severity_multiplier;
    }
}