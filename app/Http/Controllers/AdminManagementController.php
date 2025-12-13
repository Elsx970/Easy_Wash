<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Transaction;
use App\Models\WashStatus;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminManagementController extends Controller
{
    /**
     * Get all users (for admin table)
     */
    public function getUsers(): JsonResponse
    {
        $users = User::where('role', 'user')
            ->select(['id', 'name', 'email', 'role', 'created_at', 'email_verified_at'])
            ->latest()
            ->get();

        return response()->json($users);
    }

    /**
     * Delete a user
     */
    public function deleteUser($id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * Update wash status
     */
    public function updateWashStatus($id, Request $request): JsonResponse
    {
        $washStatus = WashStatus::findOrFail($id);
        $washStatus->update($request->validate([
            'status' => 'required|in:waiting,washing,drying,quality_check,completed',
            'progress_percentage' => 'required|integer|min:0|max:100',
            'notes' => 'nullable|string',
        ]));

        return response()->json(['message' => 'Wash status updated', 'data' => $washStatus]);
    }

    /**
     * Get transaction details
     */
    public function getTransactionDetails($id): JsonResponse
    {
        $transaction = Transaction::with(['booking' => function ($q) {
            $q->with(['user', 'service']);
        }])->findOrFail($id);

        return response()->json($transaction);
    }

    /**
     * Update transaction status
     */
    public function updateTransactionStatus($id, Request $request): JsonResponse
    {
        $transaction = Transaction::findOrFail($id);
        $transaction->update($request->validate([
            'status' => 'required|in:pending,completed,failed',
        ]));

        return response()->json(['message' => 'Transaction status updated', 'data' => $transaction]);
    }
}
