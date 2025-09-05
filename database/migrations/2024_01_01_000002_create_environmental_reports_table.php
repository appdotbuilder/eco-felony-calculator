<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('environmental_reports', function (Blueprint $table) {
            $table->id();
            $table->string('case_number')->unique()->comment('Police case reference number');
            $table->foreignId('user_id')->constrained();
            $table->foreignId('damage_category_id')->constrained();
            $table->string('location')->comment('Location of incident');
            $table->decimal('latitude', 10, 8)->nullable()->comment('Latitude coordinate');
            $table->decimal('longitude', 11, 8)->nullable()->comment('Longitude coordinate');
            $table->decimal('affected_area', 12, 2)->nullable()->comment('Affected area in square meters');
            $table->decimal('pollutant_volume', 12, 2)->nullable()->comment('Volume of pollutants in cubic meters');
            $table->integer('affected_animals')->nullable()->comment('Number of affected animals');
            $table->enum('severity_level', ['low', 'medium', 'high', 'critical'])->default('medium')->comment('Severity assessment');
            $table->decimal('calculated_damage', 15, 2)->comment('Total calculated damage in USD');
            $table->json('ecological_data')->nullable()->comment('Ecological information from API');
            $table->text('notes')->nullable()->comment('Additional notes');
            $table->json('ai_analysis')->nullable()->comment('Future AI analysis results');
            $table->enum('status', ['draft', 'submitted', 'reviewed', 'closed'])->default('draft')->comment('Report status');
            $table->timestamps();
            
            $table->index('case_number');
            $table->index('user_id');
            $table->index('damage_category_id');
            $table->index('status');
            $table->index('severity_level');
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('environmental_reports');
    }
};