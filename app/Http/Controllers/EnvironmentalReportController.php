<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEnvironmentalReportRequest;
use App\Http\Requests\UpdateEnvironmentalReportRequest;
use App\Models\DamageCategory;
use App\Models\EnvironmentalReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EnvironmentalReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reports = EnvironmentalReport::with(['user', 'damageCategory'])
            ->latest()
            ->paginate(15);

        return Inertia::render('environmental-reports/index', [
            'reports' => $reports,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = DamageCategory::active()
            ->orderBy('name')
            ->get();

        return Inertia::render('environmental-reports/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEnvironmentalReportRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();
        $data['case_number'] = EnvironmentalReport::generateCaseNumber();

        // Create the report
        $report = EnvironmentalReport::create($data);
        
        // Calculate damage
        $report->calculated_damage = $report->calculateDamage();
        $report->save();

        return redirect()->route('environmental-reports.show', $report)
            ->with('success', 'Environmental report created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(EnvironmentalReport $environmentalReport)
    {
        $environmentalReport->load(['user', 'damageCategory']);

        return Inertia::render('environmental-reports/show', [
            'report' => $environmentalReport,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EnvironmentalReport $environmentalReport)
    {
        $categories = DamageCategory::active()
            ->orderBy('name')
            ->get();

        return Inertia::render('environmental-reports/edit', [
            'report' => $environmentalReport,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEnvironmentalReportRequest $request, EnvironmentalReport $environmentalReport)
    {
        $data = $request->validated();
        
        $environmentalReport->update($data);
        
        // Recalculate damage
        $environmentalReport->calculated_damage = $environmentalReport->calculateDamage();
        $environmentalReport->save();

        return redirect()->route('environmental-reports.show', $environmentalReport)
            ->with('success', 'Environmental report updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EnvironmentalReport $environmentalReport)
    {
        $environmentalReport->delete();

        return redirect()->route('environmental-reports.index')
            ->with('success', 'Environmental report deleted successfully.');
    }


}