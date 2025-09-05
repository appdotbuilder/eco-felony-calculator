import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calculator, Save, FileText } from 'lucide-react';

interface DamageCategory {
    id: number;
    name: string;
    description: string;
    base_cost_per_unit: number;
    unit_type: string;
    severity_multiplier: number;
}

interface Props {
    categories: DamageCategory[];
}

export default function CreateEnvironmentalReport({ categories }: Props) {
    const [calculatedDamage, setCalculatedDamage] = useState<number | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        damage_category_id: '',
        location: '',
        latitude: '',
        longitude: '',
        affected_area: '',
        pollutant_volume: '',
        affected_animals: '',
        severity_level: 'medium',
        notes: '',
        status: 'draft',
    });

    const selectedCategory = categories.find(cat => cat.id.toString() === data.damage_category_id);

    const calculateDamage = () => {
        if (!selectedCategory) return;

        const severityMultiplier = {
            'low': 0.5,
            'medium': 1.0,
            'high': 2.0,
            'critical': 5.0,
        }[data.severity_level] || 1.0;

        const unitValue = {
            'sqm': parseFloat(data.affected_area) || 0,
            'cubic_meter': parseFloat(data.pollutant_volume) || 0,
            'animal': parseInt(data.affected_animals) || 0,
        }[selectedCategory.unit_type] || 1;

        const damage = selectedCategory.base_cost_per_unit * unitValue * severityMultiplier * selectedCategory.severity_multiplier;
        setCalculatedDamage(damage);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/environmental-reports');
    };

    return (
        <AppShell>
            <Head title="Create Environmental Report" />
            
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-green-600" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Create Environmental Report</h1>
                        <p className="text-gray-600">Document and assess environmental damage</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Enter the basic details of the environmental incident
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="damage_category_id">Damage Category *</Label>
                                    <Select 
                                        value={data.damage_category_id} 
                                        onValueChange={(value) => setData('damage_category_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select damage category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.damage_category_id && (
                                        <p className="text-sm text-red-600 mt-1">{errors.damage_category_id}</p>
                                    )}
                                </div>

                                {selectedCategory && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium">{selectedCategory.name}</p>
                                        <p className="text-xs text-gray-600 mt-1">{selectedCategory.description}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Base cost: ${selectedCategory.base_cost_per_unit} per {selectedCategory.unit_type}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="location">Location *</Label>
                                    <Input
                                        id="location"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="e.g., Main River near Industrial District"
                                    />
                                    {errors.location && (
                                        <p className="text-sm text-red-600 mt-1">{errors.location}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="latitude">Latitude</Label>
                                        <Input
                                            id="latitude"
                                            type="number"
                                            step="any"
                                            value={data.latitude}
                                            onChange={(e) => setData('latitude', e.target.value)}
                                            placeholder="e.g., 40.7128"
                                        />
                                        {errors.latitude && (
                                            <p className="text-sm text-red-600 mt-1">{errors.latitude}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="longitude">Longitude</Label>
                                        <Input
                                            id="longitude"
                                            type="number"
                                            step="any"
                                            value={data.longitude}
                                            onChange={(e) => setData('longitude', e.target.value)}
                                            placeholder="e.g., -74.0060"
                                        />
                                        {errors.longitude && (
                                            <p className="text-sm text-red-600 mt-1">{errors.longitude}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="severity_level">Severity Level *</Label>
                                    <Select 
                                        value={data.severity_level} 
                                        onValueChange={(value) => setData('severity_level', value)}
                                    >
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
                                    {errors.severity_level && (
                                        <p className="text-sm text-red-600 mt-1">{errors.severity_level}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Damage Parameters */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Damage Parameters</CardTitle>
                                <CardDescription>
                                    Enter specific measurements based on the type of damage
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {selectedCategory && (
                                    <>
                                        {selectedCategory.unit_type === 'sqm' && (
                                            <div>
                                                <Label htmlFor="affected_area">Affected Area (square meters)</Label>
                                                <Input
                                                    id="affected_area"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={data.affected_area}
                                                    onChange={(e) => setData('affected_area', e.target.value)}
                                                />
                                                {errors.affected_area && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.affected_area}</p>
                                                )}
                                            </div>
                                        )}
                                        
                                        {selectedCategory.unit_type === 'cubic_meter' && (
                                            <div>
                                                <Label htmlFor="pollutant_volume">Pollutant Volume (cubic meters)</Label>
                                                <Input
                                                    id="pollutant_volume"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={data.pollutant_volume}
                                                    onChange={(e) => setData('pollutant_volume', e.target.value)}
                                                />
                                                {errors.pollutant_volume && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.pollutant_volume}</p>
                                                )}
                                            </div>
                                        )}
                                        
                                        {selectedCategory.unit_type === 'animal' && (
                                            <div>
                                                <Label htmlFor="affected_animals">Number of Affected Animals</Label>
                                                <Input
                                                    id="affected_animals"
                                                    type="number"
                                                    min="0"
                                                    value={data.affected_animals}
                                                    onChange={(e) => setData('affected_animals', e.target.value)}
                                                />
                                                {errors.affected_animals && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.affected_animals}</p>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={calculateDamage}
                                    disabled={!selectedCategory}
                                    className="w-full"
                                >
                                    <Calculator className="w-4 h-4 mr-2" />
                                    Calculate Damage Preview
                                </Button>

                                {calculatedDamage !== null && (
                                    <Card className="bg-green-50 border-green-200">
                                        <CardContent className="p-4 text-center">
                                            <h3 className="font-semibold text-green-800 mb-2">Estimated Damage</h3>
                                            <div className="text-2xl font-bold text-green-900">
                                                ${calculatedDamage.toLocaleString()}
                                            </div>
                                            <p className="text-sm text-green-700 mt-2">
                                                This will be recalculated when the report is saved
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}

                                <div>
                                    <Label htmlFor="notes">Additional Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Any additional information about the incident..."
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Form Actions */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <Label htmlFor="status">Report Status</Label>
                                    <Select 
                                        value={data.status} 
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger className="w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Save as Draft</SelectItem>
                                            <SelectItem value="submitted">Submit Report</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Saving...' : 'Save Report'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppShell>
    );
}