<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEnvironmentalReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'damage_category_id' => 'required|exists:damage_categories,id',
            'location' => 'required|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'affected_area' => 'nullable|numeric|min:0',
            'pollutant_volume' => 'nullable|numeric|min:0',
            'affected_animals' => 'nullable|integer|min:0',
            'severity_level' => 'required|in:low,medium,high,critical',
            'notes' => 'nullable|string',
            'ecological_data' => 'nullable|array',
            'status' => 'sometimes|in:draft,submitted,reviewed,closed',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'damage_category_id.required' => 'Please select a damage category.',
            'damage_category_id.exists' => 'Selected damage category is invalid.',
            'location.required' => 'Location is required.',
            'latitude.between' => 'Latitude must be between -90 and 90.',
            'longitude.between' => 'Longitude must be between -180 and 180.',
            'affected_area.min' => 'Affected area must be a positive number.',
            'pollutant_volume.min' => 'Pollutant volume must be a positive number.',
            'affected_animals.min' => 'Number of affected animals must be a positive number.',
            'severity_level.required' => 'Please select a severity level.',
            'severity_level.in' => 'Invalid severity level selected.',
        ];
    }
}