<?php

namespace Database\Factories;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'name' => Str::title($name),
            'description' => fake()->sentence(10),
            'price' => fake()->randomFloat(2, 20000, 300000),
            'image' => null,
            'stock' => fake()->numberBetween(0, 50),
            'is_active' => true,
        ];
    }
}
