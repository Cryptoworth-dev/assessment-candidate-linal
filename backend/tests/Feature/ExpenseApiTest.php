<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Expense;

class ExpenseApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_expenses()
    {
        Expense::factory()->count(5)->create();

        $response = $this->getJson('/api/expenses');

        $response->assertStatus(200)
                 ->assertJsonCount(5, 'data');
    }

    public function test_can_create_expense()
    {
        $payload = [
            'description' => 'Test Expense',
            'amount' => 100.50,
            'category' => 'Test Category',
            'date' => '2026-08-06',
        ];

        $response = $this->postJson('/api/expenses', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('data.description', 'Test Expense');

        $this->assertDatabaseHas('expenses', [
            'description' => 'Test Expense'
        ]);
    }

    public function test_cannot_create_expense_with_invalid_data()
    {
        $payload = [
            'description' => '', // Invalid: required
            'amount' => -10,     // Invalid: must be positive
        ];

        $response = $this->postJson('/api/expenses', $payload);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['description', 'amount', 'category', 'date']);
    }

    public function test_can_show_expense()
    {
        $expense = Expense::factory()->create();

        $response = $this->getJson("/api/expenses/{$expense->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('data.id', $expense->id);
    }

    public function test_cannot_show_non_existent_expense()
    {
        $response = $this->getJson('/api/expenses/99999');

        $response->assertStatus(404);
    }

    public function test_can_update_expense()
    {
        $expense = Expense::factory()->create();

        $payload = [
            'description' => 'Updated Expense',
            'amount' => 200.00,
            'category' => 'Updated Category',
            'date' => '2026-08-07',
        ];

        $response = $this->putJson("/api/expenses/{$expense->id}", $payload);

        $response->assertStatus(200)
                 ->assertJsonPath('data.description', 'Updated Expense');

        $this->assertDatabaseHas('expenses', [
            'id' => $expense->id,
            'description' => 'Updated Expense'
        ]);
    }

    public function test_cannot_update_expense_with_invalid_data()
    {
        $expense = Expense::factory()->create();

        $payload = [
            'description' => '',
            'amount' => -50,
            'category' => '',
            'date' => 'invalid-date',
        ];

        $response = $this->putJson("/api/expenses/{$expense->id}", $payload);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['description', 'amount', 'category', 'date']);
    }

    public function test_can_delete_expense()
    {
        $expense = Expense::factory()->create();

        $response = $this->deleteJson("/api/expenses/{$expense->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('expenses', [
            'id' => $expense->id
        ]);
    }

    public function test_cannot_delete_non_existent_expense()
    {
        $response = $this->deleteJson('/api/expenses/99999');

        $response->assertStatus(404);
    }
}
