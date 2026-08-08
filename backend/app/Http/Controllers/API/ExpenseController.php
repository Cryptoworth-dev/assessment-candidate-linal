<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use App\Models\Expense;
use App\Services\ExpenseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\ExpenseResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ExpenseController extends Controller
{
    use AuthorizesRequests;

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
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'category', 'start_date', 'end_date', 'sort_by', 'sort_dir']);
        $expenses = $this->expenseService->getAllExpenses($filters);

        return ExpenseResource::collection($expenses)->additional(['message' => 'Expenses retrieved successfully']);
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
     * Export expenses to CSV.
     * @param \Illuminate\Http\Request $request
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function export(Request $request)
    {
        $filters = $request->only(['search', 'category', 'start_date', 'end_date', 'sort_by', 'sort_dir']);
        $expenses = $this->expenseService->getExpensesForExport($filters);

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="expenses.csv"',
        ];

        $callback = function () use ($expenses) {
            $file = fopen('php://output', 'w');
            
            fputcsv($file, ['No.', 'Description', 'Amount', 'Category', 'Date']);
            
            $index = 1;
            foreach ($expenses as $expense) {
                fputcsv($file, [
                    $index++,
                    $expense->description,
                    $expense->amount,
                    $expense->category,
                    $expense->date,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Store a newly created expense in storage.
     * @param \App\Http\Requests\StoreExpenseRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreExpenseRequest $request)
    {
        $expense = $this->expenseService->createExpense($request->validated());

        return (new ExpenseResource($expense))
            ->additional(['message' => 'Expense created successfully'])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified expense.
     * @param \App\Models\Expense $expense
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Expense $expense)
    {
        $this->authorize('view', $expense);

        return (new ExpenseResource($expense))->additional(['message' => 'Expense retrieved successfully']);
    }

    /**
     * Update the specified expense in storage.
     * @param \App\Http\Requests\UpdateExpenseRequest $request
     * @param \App\Models\Expense $expense
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateExpenseRequest $request, Expense $expense)
    {
        $this->authorize('update', $expense);

        $updatedExpense = $this->expenseService->updateExpense($expense, $request->validated());

        return (new ExpenseResource($updatedExpense))->additional(['message' => 'Expense updated successfully']);
    }

    /**
     * Remove the specified expense from storage.
     * @param \App\Models\Expense $expense
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Expense $expense): JsonResponse
    {
        $this->authorize('delete', $expense);

        $this->expenseService->deleteExpense($expense);

        return response()->json(null, 204);
    }
}
