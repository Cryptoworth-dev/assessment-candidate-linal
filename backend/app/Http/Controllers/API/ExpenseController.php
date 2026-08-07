<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use App\Models\Expense;
use App\Services\ExpenseService;
use Illuminate\Http\JsonResponse;

use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    /**
     * @var ExpenseService
     */
    protected $expenseService;

    /**
     * ExpenseController constructor.
     * @param ExpenseService $expenseService
     */
    public function __construct(ExpenseService $expenseService)
    {
        $this->expenseService = $expenseService;
    }

    /**
     * Display a listing of the expenses.
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'category', 'start_date', 'end_date', 'sort_by', 'sort_dir']);
        $expenses = $this->expenseService->getAllExpenses($filters);

        return response()->json([
            'message' => 'Expenses retrieved successfully',
            'data' => $expenses
        ], 200);
    }
    /**
     * Display a spending summary (total spend and per category).
     * @return \Illuminate\Http\JsonResponse
     */
    public function summary(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'category', 'start_date', 'end_date']);
        $summary = $this->expenseService->getSpendingSummary($filters);

        return response()->json([
            'message' => 'Spending summary retrieved successfully',
            'data' => $summary
        ], 200);
    }


    /**
     * Store a newly created expense in storage.
     * @param \App\Http\Requests\StoreExpenseRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreExpenseRequest $request): JsonResponse
    {
        $expense = $this->expenseService->createExpense($request->validated());

        return response()->json([
            'message' => 'Expense created successfully',
            'data' => $expense
        ], 201);
    }

    /**
     * Display the specified expense.
     * @param \App\Models\Expense $expense
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Expense $expense): JsonResponse
    {
        return response()->json([
            'message' => 'Expense retrieved successfully',
            'data' => $expense
        ], 200);
    }

    /**
     * Update the specified expense in storage.
     * @param \App\Http\Requests\UpdateExpenseRequest $request
     * @param \App\Models\Expense $expense
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateExpenseRequest $request, Expense $expense): JsonResponse
    {
        $updatedExpense = $this->expenseService->updateExpense($expense, $request->validated());

        return response()->json([
            'message' => 'Expense updated successfully',
            'data' => $updatedExpense
        ], 200);
    }

    /**
     * Remove the specified expense from storage.
     * @param \App\Models\Expense $expense
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Expense $expense): JsonResponse
    {
        $this->expenseService->deleteExpense($expense);

        return response()->json(null, 204);
    }
}
