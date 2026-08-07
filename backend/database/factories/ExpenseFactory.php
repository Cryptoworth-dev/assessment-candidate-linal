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
        $categories = [
            'Food' => ['Groceries at Whole Foods', 'Dinner at Italian Restaurant', 'Starbucks Coffee', 'Lunch at Sweetgreen', 'UberEats Delivery'],
            'Transport' => ['Uber ride', 'Gas station', 'Train ticket', 'Bus pass', 'Car wash'],
            'Rent' => ['Monthly rent', 'Apartment maintenance fee', 'Renter\'s insurance'],
            'Utilities' => ['Electricity bill', 'Water bill', 'Internet subscription', 'Phone bill', 'Heating bill'],
            'Entertainment' => ['Netflix subscription', 'Movie tickets', 'Spotify Premium', 'Concert tickets', 'Video game purchase'],
            'Health' => ['Pharmacy', 'Doctor visit copay', 'Gym membership', 'Vitamins'],
            'Other' => ['Office supplies', 'Gift for a friend', 'Books', 'Miscellaneous shopping']
        ];

        $category = fake()->randomElement(array_keys($categories));
        $description = fake()->randomElement($categories[$category]);

        return [
            'description' => $description,
            'amount' => fake()->randomFloat(2, 5, 200), // More realistic amounts
            'category' => $category,
            'date' => fake()->dateTimeBetween('-4 months', 'now')->format('Y-m-d'),
        ];
    }
}
