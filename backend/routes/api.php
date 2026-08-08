<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ExpenseController;
use App\Http\Controllers\API\AuthController;

Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:auth');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:auth');

Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('expenses/summary', [ExpenseController::class, 'summary'])->withoutMiddleware('throttle:api')->middleware('throttle:heavy');
    Route::get('expenses/export', [ExpenseController::class, 'export'])->withoutMiddleware('throttle:api')->middleware('throttle:heavy');
    Route::apiResource('expenses', ExpenseController::class);
});
