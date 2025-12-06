<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    /**
     * Display invoice for a booking.
     */
    public function show(Request $request, Booking $booking): Response
    {
        $user = $request->user();

        // Check authorization: user can only view their own invoices, admin can view all
        if (! $user->isAdmin() && $booking->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses untuk melihat invoice ini.');
        }

        $booking->load(['service', 'user', 'location']);

        return Inertia::render('Invoices/Show', [
            'booking' => $booking,
        ]);
    }

    /**
     * Download invoice as PDF (placeholder for future implementation).
     */
    public function download(Request $request, Booking $booking)
    {
        $user = $request->user();

        // Check authorization
        if (! $user->isAdmin() && $booking->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses untuk mengunduh invoice ini.');
        }

        $booking->load(['service', 'user', 'location']);

        // TODO: Implement PDF generation
        // For now, return JSON response
        return response()->json([
            'message' => 'PDF download akan diimplementasikan nanti.',
            'booking' => $booking,
        ]);
    }
}
