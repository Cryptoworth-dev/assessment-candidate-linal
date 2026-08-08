<?php

namespace Database\Seeders;

use App\Models\Expense;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExpenseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $expensesData = Expense::factory()->count(100)->make()->toArray();
        
        $users = \App\Models\User::whereIn('email', ['user1@example.com', 'user2@example.com'])->get();
        
        foreach ($users as $user) {
            $userExpenses = array_map(function($expense) use ($user) {
                $expense['user_id'] = $user->id;
                $expense['created_at'] = now();
                $expense['updated_at'] = now();
                return $expense;
            }, $expensesData);
            
            Expense::insert($userExpenses);
        }
    }
}
