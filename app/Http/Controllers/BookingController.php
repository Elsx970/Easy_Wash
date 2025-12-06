<?php

namespace App\Http\Controllers;

use App\BookingStatus;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Models\Booking;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->isAdmin();

        $bookings = Booking::query()
            ->with(['service', 'user', 'location'])
            ->when(! $isAdmin, function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('vehicle_plate', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Bookings/Index', [
            'bookings' => $bookings,
            'filters' => $request->only(['search', 'status']),
            'isAdmin' => $isAdmin,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $services = Service::all();

        return Inertia::render('Bookings/Create', [
            'services' => $services,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookingRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $service = Service::findOrFail($validated['service_id']);

        // Calculate estimated finish time based on queue
        $scheduledAt = Carbon::parse($validated['scheduled_at']);
        $estimatedFinishAt = $this->calculateEstimatedFinishTime($service, $scheduledAt);

        $booking = Booking::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'status' => BookingStatus::Pending->value,
            'estimated_finish_at' => $estimatedFinishAt,
            'booking_code' => Booking::generateBookingCode(),
        ]);

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Pemesanan berhasil dibuat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking): Response
    {
        $user = auth()->user();

        // Check authorization: user can only view their own bookings, admin can view all
        if (! $user->isAdmin() && $booking->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses untuk melihat pemesanan ini.');
        }

        $booking->load(['service', 'user', 'location']);

        return Inertia::render('Bookings/Show', [
            'booking' => $booking,
            'canUpdate' => $this->canUpdate($booking),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booking $booking): Response
    {
        $booking->load(['service', 'user', 'location']);

        return Inertia::render('Bookings/Edit', [
            'booking' => $booking,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookingRequest $request, Booking $booking): RedirectResponse
    {
        $validated = $request->validated();

        // If status changed to in_progress, recalculate estimated finish time
        if (isset($validated['status']) && $validated['status'] === BookingStatus::InProgress->value) {
            $service = $booking->service;
            $estimatedFinishAt = $this->calculateEstimatedFinishTime($service, $booking->scheduled_at);
            $validated['estimated_finish_at'] = $estimatedFinishAt;
        }

        $booking->update($validated);

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Pemesanan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking): RedirectResponse
    {
        $booking->delete();

        return redirect()->route('bookings.index')
            ->with('success', 'Pemesanan berhasil dibatalkan.');
    }

    /**
     * Get queue status for real-time display.
     */
    public function queue(Request $request): Response
    {
        $bookings = Booking::query()
            ->with(['service', 'user', 'location'])
            ->whereIn('status', [BookingStatus::Pending->value, BookingStatus::InProgress->value])
            ->orderBy('scheduled_at')
            ->get();

        return Inertia::render('Bookings/Queue', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * Calculate estimated finish time based on queue.
     */
    private function calculateEstimatedFinishTime(Service $service, Carbon $scheduledAt): Carbon
    {
        // Get all pending or in-progress bookings before this scheduled time
        $previousBookings = Booking::query()
            ->where('scheduled_at', '<=', $scheduledAt)
            ->whereIn('status', [BookingStatus::Pending->value, BookingStatus::InProgress->value])
            ->orderBy('scheduled_at')
            ->get();

        $totalDuration = 0;
        foreach ($previousBookings as $previousBooking) {
            $totalDuration += $previousBooking->service->duration_minutes;
        }

        // Add current service duration
        $totalDuration += $service->duration_minutes;

        return $scheduledAt->copy()->addMinutes($totalDuration);
    }

    /**
     * Check if user can update booking.
     */
    private function canUpdate(Booking $booking): bool
    {
        $user = auth()->user();

        if ($user->isAdmin()) {
            return true;
        }

        return $booking->user_id === $user->id && $booking->status === BookingStatus::Pending->value;
    }
}
