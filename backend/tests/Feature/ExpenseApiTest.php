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
                 ->assertJsonCount(5, 'data.data');
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
    public function test_can_get_spending_summary()
    {
        Expense::factory()->create(['category' => 'Food', 'amount' => 50.00]);
        Expense::factory()->create(['category' => 'Food', 'amount' => 25.50]);
        Expense::factory()->create(['category' => 'Transport', 'amount' => 100.00]);

        $response = $this->getJson('/api/expenses/summary');

        $response->assertStatus(200)
                 ->assertJsonPath('data.total_spend', 175.50)
                 ->assertJsonPath('data.by_category.Food', 75.50)
                 ->assertJsonPath('data.by_category.Transport', 100);
    }

    public function test_can_list_expenses_with_filters()
    {
        Expense::factory()->create(['description' => 'Apple', 'category' => 'Food', 'date' => '2026-08-01']);
        Expense::factory()->create(['description' => 'Banana', 'category' => 'Food', 'date' => '2026-08-05']);
        Expense::factory()->create(['description' => 'Bus Ticket', 'category' => 'Transport', 'date' => '2026-08-03']);
        $response = $this->getJson('/api/expenses?category=Food');
        $response->assertStatus(200)->assertJsonCount(2, 'data.data');

        $response = $this->getJson('/api/expenses?search=Apple');
        $response->assertStatus(200)->assertJsonCount(1, 'data.data');
        
        $response = $this->getJson('/api/expenses?start_date=2026-08-02&end_date=2026-08-06');
        $response->assertStatus(200)->assertJsonCount(2, 'data.data');
    }

    public function test_spending_summary_category_filter_behavior()
    {
        Expense::factory()->create(['category' => 'Food', 'amount' => 50.00]);
        Expense::factory()->create(['category' => 'Transport', 'amount' => 100.00]);

        $response = $this->getJson('/api/expenses/summary?category=Food');

        $response->assertStatus(200)
                 ->assertJsonPath('data.total_spend', 50)
                 ->assertJsonPath('data.by_category.Food', 50)
                 ->assertJsonPath('data.by_category.Transport', 100);
    }

    public function test_can_export_expenses_to_csv()
    {
        Expense::factory()->create([
            'description' => 'Test CSV Export', 
            'amount' => 45.00, 
            'category' => 'Food',
            'date' => '2026-08-07'
        ]);

        $response = $this->get('/api/expenses/export');

        $response->assertStatus(200)
                 ->assertHeader('Content-Type', 'text/csv; charset=UTF-8')
                 ->assertHeader('Content-Disposition', 'attachment; filename="expenses.csv"');

        $content = $response->streamedContent();
        
        $this->assertStringContainsString('No.,Description,Amount,Category,Date', $content);
        $this->assertStringContainsString('1,"Test CSV Export",45.00,Food,"2026-08-07 00:00:00"', $content);
    }
}
