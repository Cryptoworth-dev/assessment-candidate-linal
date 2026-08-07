<?php

namespace App\Services;

use App\Models\Expense;
use Illuminate\Database\Eloquent\Collection;

use Illuminate\Pagination\LengthAwarePaginator;

class ExpenseService
{
    /**
     * Get all expenses ordered by the most recent first, with optional filters and pagination.
     * @param array $filters
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function getAllExpenses(array $filters = []): LengthAwarePaginator
    {
        $query = Expense::query();

        if (!empty($filters['search'])) {
            $query->where('description', 'like', '%' . $filters['search'] . '%');
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (!empty($filters['start_date'])) {
            $query->whereDate('date', '>=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $query->whereDate('date', '<=', $filters['end_date']);
        }

        $sortBy = $filters['sort_by'] ?? 'date';
        $sortDir = $filters['sort_dir'] ?? 'desc';

        $allowedSorts = ['date', 'amount'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'date';
        }

        $sortDir = strtolower($sortDir) === 'asc' ? 'asc' : 'desc';

        return $query->orderBy($sortBy, $sortDir)->orderBy('created_at', 'desc')->paginate(10);
    }

    /**
     * Get all expenses for export as a Collection (not paginated).
     * @param array $filters
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getExpensesForExport(array $filters = []): Collection
    {
        $query = Expense::query();

        if (!empty($filters['search'])) {
            $query->where('description', 'ilike', '%' . $filters['search'] . '%');
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (!empty($filters['start_date'])) {
            $query->whereDate('date', '>=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $query->whereDate('date', '<=', $filters['end_date']);
        }

        $sortBy = $filters['sort_by'] ?? 'date';
        $sortDir = $filters['sort_dir'] ?? 'desc';

        $allowedSorts = ['date', 'amount'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'date';
        }

        $sortDir = strtolower($sortDir) === 'asc' ? 'asc' : 'desc';

        return $query->orderBy($sortBy, $sortDir)->orderBy('created_at', 'desc')->get();
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

    /**
     * Compute the total spend overall and per category.
     * @return array
     */
    public function getSpendingSummary(array $filters = []): array
    {
        $baseQuery = Expense::query();
        
        if (!empty($filters['search'])) {
            $baseQuery->where('description', 'like', '%' . $filters['search'] . '%');
        }
        if (!empty($filters['start_date'])) {
            $baseQuery->whereDate('date', '>=', $filters['start_date']);
        }
        if (!empty($filters['end_date'])) {
            $baseQuery->whereDate('date', '<=', $filters['end_date']);
        }

        // 1. Compute per-category spending without applying the category filter
        // This ensures the pie chart always shows all categories
        $perCategory = (clone $baseQuery)->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->category => (float) $item->total];
            })
            ->toArray();

        // 2. Now apply the category filter for total spend and over time chart
        if (!empty($filters['category'])) {
            $baseQuery->where('category', $filters['category']);
        }

        $totalSpend = (float) (clone $baseQuery)->sum('amount');

        $overTime = (clone $baseQuery)->selectRaw('date, SUM(amount) as total')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'total' => (float) $item->total,
                ];
            })
            ->toArray();

        return [
            'total_spend' => $totalSpend,
            'by_category' => $perCategory,
            'over_time' => $overTime,
        ];
    }
}
