<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\DamageCategory
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property float $base_cost_per_unit
 * @property string $unit_type
 * @property float $severity_multiplier
 * @property bool $active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\EnvironmentalReport> $reports
 * @property-read int|null $reports_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|DamageCategory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DamageCategory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DamageCategory query()
 * @method static \Illuminate\Database\Eloquent\Builder|DamageCategory whereActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DamageCategory whereBaseCostPerUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DamageCategory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DamageCategory whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DamageCategory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DamageCategory whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DamageCategory whereSeverityMultiplier($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DamageCategory whereUnitType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DamageCategory whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DamageCategory active()
 * @method static \Database\Factories\DamageCategoryFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class DamageCategory extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'description',
        'base_cost_per_unit',
        'unit_type',
        'severity_multiplier',
        'active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'base_cost_per_unit' => 'decimal:2',
        'severity_multiplier' => 'decimal:2',
        'active' => 'boolean',
    ];

    /**
     * Get the reports for this damage category.
     */
    public function reports(): HasMany
    {
        return $this->hasMany(EnvironmentalReport::class);
    }

    /**
     * Scope a query to only include active categories.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}