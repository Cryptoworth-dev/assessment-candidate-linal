<?php

namespace Database\Factories;

use App\Models\Expense;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Expense>
 */
class ExpenseFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = Expense::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'description' => fake()->sentence(3),
            'amount' => fake()->randomFloat(2, 1, 1000),
            'category' => fake()->randomElement(['Food', 'Transport', 'Rent', 'Utilities', 'Entertainment']),
            'date' => fake()->date(),
        ];
    }
}
