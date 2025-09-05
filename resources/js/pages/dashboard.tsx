import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Calculator, MapPin, Plus, TrendingUp, FileText, Leaf } from 'lucide-react';

interface DamageCategory {
    id: number;
    name: string;
    description: string;
    base_cost_per_unit: number;
    unit_type: string;
    severity_multiplier: number;
}

interface EnvironmentalReport {
    id: number;
    case_number: string;
    location: string;
    severity_level: string;
    calculated_damage: number;
    status: string;
    damage_category: {
        name: string;
    };
    user: {
        name: string;
    };
    created_at: string;
}

interface Statistics {
    total_reports: number;
    total_damage: number;
    critical_reports: number;
    active_categories: number;
}

interface Props {
    categories: DamageCategory[];
    recentReports: EnvironmentalReport[];
    statistics: Statistics;
}

interface CalculationResult {
    success: boolean;
    calculated_damage: string;
    breakdown: {
        base_cost: number;
        unit_value: number;
        unit_type: string;
        severity_multiplier: number;
        category_multiplier: number;
        total: number;
    };
}

export default function Dashboard({ categories, recentReports, statistics }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [formData, setFormData] = useState({
        affected_area: '',
        pollutant_volume: '',
        affected_animals: '',
        severity_level: 'medium',
        location: '',
    });
    const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    const handleCalculate = async () => {
        if (!selectedCategory) return;

        setIsCalculating(true);
        try {
            const response = await fetch('/calculate-damage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    damage_category_id: selectedCategory,
                    ...formData,
                }),
            });

            const result = await response.json();
            setCalculationResult(result);
        } catch (error) {
            console.error('Calculation failed:', error);
        } finally {
            setIsCalculating(false);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'low': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'critical': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft': return 'bg-gray-100 text-gray-800';
            case 'submitted': return 'bg-blue-100 text-blue-800';
            case 'reviewed': return 'bg-purple-100 text-purple-800';
            case 'closed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const selectedCat = categories.find(cat => cat.id.toString() === selectedCategory);

    return (
        <AppShell>
            <Head title="Environmental Damage Dashboard" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <Leaf className="w-8 h-8 text-green-600 mr-3" />
                            Environmental Crime Dashboard
                        </h1>
                        <p className="text-gray-600 mt-1">Calculate and track environmental damage assessments</p>
                    </div>
                    <Button 
                        onClick={() => router.get('/environmental-reports/create')}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Report
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <FileText className="w-8 h-8 text-blue-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Reports</p>
                                    <p className="text-2xl font-bold text-gray-900">{statistics.total_reports}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <TrendingUp className="w-8 h-8 text-green-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Damage</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        ${statistics.total_damage.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <AlertCircle className="w-8 h-8 text-red-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Critical Cases</p>
                                    <p className="text-2xl font-bold text-gray-900">{statistics.critical_reports}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Calculator className="w-8 h-8 text-purple-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Categories</p>
                                    <p className="text-2xl font-bold text-gray-900">{statistics.active_categories}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Quick Calculator */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Calculator className="w-6 h-6 text-green-600" />
                                <span>Quick Damage Calculator</span>
                            </CardTitle>
                            <CardDescription>
                                Calculate environmental damage for quick assessments
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="category">Damage Category</Label>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select damage category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name} (${category.base_cost_per_unit}/{category.unit_type})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="e.g., Main River, Downtown Park"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>

                            {selectedCat && (
                                <>
                                    {selectedCat.unit_type === 'sqm' && (
                                        <div>
                                            <Label htmlFor="area">Affected Area (sq meters)</Label>
                                            <Input
                                                id="area"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={formData.affected_area}
                                                onChange={(e) => setFormData({ ...formData, affected_area: e.target.value })}
                                            />
                                        </div>
                                    )}
                                    
                                    {selectedCat.unit_type === 'cubic_meter' && (
                                        <div>
                                            <Label htmlFor="volume">Pollutant Volume (cubic meters)</Label>
                                            <Input
                                                id="volume"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={formData.pollutant_volume}
                                                onChange={(e) => setFormData({ ...formData, pollutant_volume: e.target.value })}
                                            />
                                        </div>
                                    )}
                                    
                                    {selectedCat.unit_type === 'animal' && (
                                        <div>
                                            <Label htmlFor="animals">Number of Affected Animals</Label>
                                            <Input
                                                id="animals"
                                                type="number"
                                                min="0"
                                                value={formData.affected_animals}
                                                onChange={(e) => setFormData({ ...formData, affected_animals: e.target.value })}
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            <div>
                                <Label htmlFor="severity">Severity Level</Label>
                                <Select value={formData.severity_level} onValueChange={(value) => setFormData({ ...formData, severity_level: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="critical">Critical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                onClick={handleCalculate}
                                disabled={!selectedCategory || isCalculating}
                                className="w-full bg-green-600 hover:bg-green-700"
                            >
                                {isCalculating ? 'Calculating...' : 'Calculate Damage'}
                            </Button>

                            {calculationResult && (
                                <Card className="bg-green-50 border-green-200">
                                    <CardContent className="p-4">
                                        <div className="text-center mb-3">
                                            <h3 className="text-lg font-semibold text-green-800">Estimated Damage</h3>
                                            <div className="text-3xl font-bold text-green-900">
                                                ${calculationResult.calculated_damage}
                                            </div>
                                        </div>
                                        <Separator className="my-3" />
                                        <div className="text-sm space-y-1 text-green-700">
                                            <div className="flex justify-between">
                                                <span>Base Cost ({calculationResult.breakdown.unit_type}):</span>
                                                <span>${calculationResult.breakdown.base_cost}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Unit Value:</span>
                                                <span>{calculationResult.breakdown.unit_value}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Severity Multiplier:</span>
                                                <span>{calculationResult.breakdown.severity_multiplier}x</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Reports */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                    <span>Recent Reports</span>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => router.get('/environmental-reports')}
                                >
                                    View All
                                </Button>
                            </CardTitle>
                            <CardDescription>
                                Latest environmental damage assessments
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentReports.length > 0 ? (
                                recentReports.map((report) => (
                                    <Card 
                                        key={report.id} 
                                        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => router.get(`/environmental-reports/${report.id}`)}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{report.case_number}</h4>
                                                <p className="text-sm text-gray-600 flex items-center">
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    {report.location}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <Badge className={getSeverityColor(report.severity_level)}>
                                                    {report.severity_level}
                                                </Badge>
                                                <Badge className={`${getStatusColor(report.status)} ml-1`}>
                                                    {report.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-gray-600">{report.damage_category.name}</p>
                                                <p className="text-xs text-gray-500">by {report.user.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-lg text-green-600">
                                                    ${report.calculated_damage.toLocaleString()}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(report.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No reports yet. Create your first environmental damage assessment.</p>
                                    <Button 
                                        onClick={() => router.get('/environmental-reports/create')}
                                        className="mt-4 bg-green-600 hover:bg-green-700"
                                    >
                                        Create Report
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}