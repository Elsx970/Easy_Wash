<?php

namespace App\Http\Controllers;

use App\BookingStatus;
use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->isAdmin();

        if ($isAdmin) {
            // Admin statistics
            $stats = [
                'total_bookings' => Booking::count(),
                'pending_bookings' => Booking::where('status', BookingStatus::Pending->value)->count(),
                'in_progress_bookings' => Booking::where('status', BookingStatus::InProgress->value)->count(),
                'completed_bookings' => Booking::where('status', BookingStatus::Completed->value)->count(),
                'total_services' => Service::count(),
                'total_users' => \App\Models\User::where('role', 'user')->count(),
            ];

            $recentBookings = Booking::with(['service', 'user'])
                ->latest()
                ->limit(5)
                ->get();
        } else {
            // User statistics
            $stats = [
                'total_bookings' => Booking::where('user_id', $user->id)->count(),
                'pending_bookings' => Booking::where('user_id', $user->id)
                    ->where('status', BookingStatus::Pending->value)->count(),
                'in_progress_bookings' => Booking::where('user_id', $user->id)
                    ->where('status', BookingStatus::InProgress->value)->count(),
                'completed_bookings' => Booking::where('user_id', $user->id)
                    ->where('status', BookingStatus::Completed->value)->count(),
                'total_services' => Service::count(),
            ];

            $recentBookings = Booking::with(['service', 'user'])
                ->where('user_id', $user->id)
                ->latest()
                ->limit(5)
                ->get();
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentBookings' => $recentBookings,
            'isAdmin' => $isAdmin,
        ]);
    }
}
