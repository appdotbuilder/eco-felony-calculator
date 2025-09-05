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
        Schema::create('damage_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Category name (e.g., Water Pollution, Air Pollution)');
            $table->text('description')->nullable()->comment('Category description');
            $table->decimal('base_cost_per_unit', 10, 2)->comment('Base cost per unit in USD');
            $table->string('unit_type')->comment('Unit type (sqm, cubic_meter, animal, etc.)');
            $table->decimal('severity_multiplier', 5, 2)->default(1.0)->comment('Multiplier for severity level');
            $table->boolean('active')->default(true)->comment('Whether category is active');
            $table->timestamps();
            
            $table->index('name');
            $table->index('active');
            $table->index(['active', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('damage_categories');
    }
};