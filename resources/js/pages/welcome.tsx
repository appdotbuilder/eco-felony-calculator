import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Calculator, MapPin, Shield, TrendingUp, FileText, Leaf } from 'lucide-react';

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
    [key: string]: unknown;
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

export default function Welcome({ categories, recentReports, statistics }: Props) {
    const { auth } = usePage<{ auth: { user: { name: string } | null } }>().props;
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
        <>
            <Head title="Environmental Damage Calculator" />
            
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-600 p-2 rounded-lg">
                                    <Leaf className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">🌍 Environmental Crime Calculator</h1>
                                    <p className="text-sm text-gray-600">Police Environmental Damage Assessment Tool</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-700">Welcome, {auth.user.name}</span>
                                        <Button
                                            onClick={() => router.get('/dashboard')}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            Dashboard
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => router.get('/login')}
                                        >
                                            Login
                                        </Button>
                                        <Button
                                            onClick={() => router.get('/register')}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            Register
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            🚔 Calculate Environmental Crime Damage
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                            Professional tool for law enforcement to assess economic damage from environmental crimes. 
                            Input incident parameters and get instant damage calculations with ecological impact analysis.
                        </p>
                        
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                            <Card className="text-center">
                                <CardContent className="p-4">
                                    <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">{statistics.total_reports}</div>
                                    <div className="text-sm text-gray-600">Total Reports</div>
                                </CardContent>
                            </Card>
                            <Card className="text-center">
                                <CardContent className="p-4">
                                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">
                                        ${statistics.total_damage.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Damage</div>
                                </CardContent>
                            </Card>
                            <Card className="text-center">
                                <CardContent className="p-4">
                                    <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">{statistics.critical_reports}</div>
                                    <div className="text-sm text-gray-600">Critical Cases</div>
                                </CardContent>
                            </Card>
                            <Card className="text-center">
                                <CardContent className="p-4">
                                    <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">{statistics.active_categories}</div>
                                    <div className="text-sm text-gray-600">Damage Types</div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Calculator */}
                        <Card className="p-6">
                            <CardHeader className="p-0 mb-6">
                                <CardTitle className="flex items-center space-x-2">
                                    <Calculator className="w-6 h-6 text-green-600" />
                                    <span>Damage Calculator</span>
                                </CardTitle>
                                <CardDescription>
                                    Calculate environmental damage based on incident parameters
                                </CardDescription>
                            </CardHeader>
                            
                            <div className="space-y-4">
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
                                    {isCalculating ? 'Calculating...' : '🧮 Calculate Damage'}
                                </Button>

                                {calculationResult && (
                                    <Card className="bg-green-50 border-green-200 p-4">
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
                                            <div className="flex justify-between">
                                                <span>Category Multiplier:</span>
                                                <span>{calculationResult.breakdown.category_multiplier}x</span>
                                            </div>
                                        </div>
                                    </Card>
                                )}
                            </div>
                        </Card>

                        {/* Recent Reports */}
                        <Card className="p-6">
                            <CardHeader className="p-0 mb-6">
                                <CardTitle className="flex items-center space-x-2">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                    <span>Recent Reports</span>
                                </CardTitle>
                                <CardDescription>
                                    Latest environmental damage assessments
                                </CardDescription>
                            </CardHeader>
                            
                            <div className="space-y-4">
                                {recentReports.length > 0 ? (
                                    recentReports.map((report) => (
                                        <Card key={report.id} className="p-4 hover:shadow-md transition-shadow">
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
                                        <p>No reports yet. Start by calculating environmental damage above.</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Features Section */}
                    <div className="mt-16">
                        <h3 className="text-2xl font-bold text-center mb-8">🔧 Key Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="text-center p-6">
                                <Calculator className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                <h4 className="text-lg font-semibold mb-2">Instant Calculations</h4>
                                <p className="text-gray-600">
                                    Quick damage assessment based on scientifically-backed formulas and real-world data.
                                </p>
                            </Card>
                            <Card className="text-center p-6">
                                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                <h4 className="text-lg font-semibold mb-2">Location Analysis</h4>
                                <p className="text-gray-600">
                                    Integrate with mapping APIs to assess protected areas and ecological sensitivity.
                                </p>
                            </Card>
                            <Card className="text-center p-6">
                                <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                                <h4 className="text-lg font-semibold mb-2">AI Integration Ready</h4>
                                <p className="text-gray-600">
                                    Prepared for future AI analysis to enhance damage assessment accuracy.
                                </p>
                            </Card>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-16 text-center bg-green-600 rounded-lg p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">👮‍♂️ For Law Enforcement Officers</h3>
                        <p className="text-lg mb-6">
                            Create an account to save reports, track cases, and access advanced ecological data analysis.
                        </p>
                        {!auth.user && (
                            <div className="space-x-4">
                                <Button
                                    variant="secondary"
                                    onClick={() => router.get('/register')}
                                    className="bg-white text-green-600 hover:bg-gray-100"
                                >
                                    Register Now
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => router.get('/login')}
                                    className="border-white text-white hover:bg-green-700"
                                >
                                    Login
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}