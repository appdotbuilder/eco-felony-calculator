<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DamageCategory;
use App\Models\EnvironmentalReport;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with environmental damage calculator.
     */
    public function index()
    {
        $categories = DamageCategory::active()
            ->orderBy('name')
            ->get();

        $recentReports = EnvironmentalReport::with(['user', 'damageCategory'])
            ->latest()
            ->take(5)
            ->get();

        $statistics = [
            'total_reports' => EnvironmentalReport::count(),
            'total_damage' => EnvironmentalReport::sum('calculated_damage'),
            'critical_reports' => EnvironmentalReport::where('severity_level', 'critical')->count(),
            'active_categories' => DamageCategory::active()->count(),
        ];

        return Inertia::render('dashboard', [
            'categories' => $categories,
            'recentReports' => $recentReports,
            'statistics' => $statistics,
        ]);
    }


}