<?php

namespace App\Services;

use App\Models\Expense;
use Illuminate\Database\Eloquent\Collection;

class ExpenseService
{
    /**
     * Get all expenses ordered by the most recent first.
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllExpenses(): Collection
    {
        return Expense::orderBy('date', 'desc')->orderBy('created_at', 'desc')->get();
    }

    /**
     * Create a new expense entry.
     * @param array $data
     * @return \App\Models\Expense
     */
    public function createExpense(array $data): Expense
    {
        return Expense::create($data);
    }

    /**
     * Update an existing expense entry.
     * @param \App\Models\Expense $expense
     * @param array $data
     * @return \App\Models\Expense
     */
    public function updateExpense(Expense $expense, array $data): Expense
    {
        $expense->update($data);
        
        return $expense;
    }

    /**
     * Delete an existing expense entry.
     * @param \App\Models\Expense $expense
     * @return bool|null
     */
    public function deleteExpense(Expense $expense): ?bool
    {
        return $expense->delete();
    }
}
