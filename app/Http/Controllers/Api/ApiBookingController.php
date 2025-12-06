<?php

namespace App\Http\Controllers\Api;

use App\BookingStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ApiBookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): AnonymousResourceCollection
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
            ->paginate($request->get('per_page', 15));

        return BookingResource::collection($bookings);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookingRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $service = Service::findOrFail($validated['service_id']);

        $scheduledAt = Carbon::parse($validated['scheduled_at']);
        $estimatedFinishAt = $this->calculateEstimatedFinishTime($service, $scheduledAt);

        $booking = Booking::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'status' => BookingStatus::Pending->value,
            'estimated_finish_at' => $estimatedFinishAt,
            'booking_code' => Booking::generateBookingCode(),
        ]);

        $booking->load(['service', 'user', 'location']);

        return (new BookingResource($booking))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Booking $booking): BookingResource
    {
        $user = $request->user();

        if (! $user->isAdmin() && $booking->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses untuk melihat pemesanan ini.');
        }

        $booking->load(['service', 'user', 'location']);

        return new BookingResource($booking);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookingRequest $request, Booking $booking): BookingResource
    {
        $validated = $request->validated();

        if (isset($validated['status']) && $validated['status'] === BookingStatus::InProgress->value) {
            $service = $booking->service;
            $estimatedFinishAt = $this->calculateEstimatedFinishTime($service, $booking->scheduled_at);
            $validated['estimated_finish_at'] = $estimatedFinishAt;
        }

        $booking->update($validated);
        $booking->load(['service', 'user', 'location']);

        return new BookingResource($booking);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking): JsonResponse
    {
        $booking->delete();

        return response()->json(['message' => 'Pemesanan berhasil dibatalkan.'], 200);
    }

    /**
     * Get queue status for real-time display.
     */
    public function queue(Request $request): AnonymousResourceCollection
    {
        $bookings = Booking::query()
            ->with(['service', 'user', 'location'])
            ->whereIn('status', [BookingStatus::Pending->value, BookingStatus::InProgress->value])
            ->orderBy('scheduled_at')
            ->get();

        return BookingResource::collection($bookings);
    }

    /**
     * Calculate estimated finish time based on queue.
     */
    private function calculateEstimatedFinishTime(Service $service, Carbon $scheduledAt): Carbon
    {
        $previousBookings = Booking::query()
            ->where('scheduled_at', '<=', $scheduledAt)
            ->whereIn('status', [BookingStatus::Pending->value, BookingStatus::InProgress->value])
            ->orderBy('scheduled_at')
            ->get();

        $totalDuration = 0;
        foreach ($previousBookings as $previousBooking) {
            $totalDuration += $previousBooking->service->duration_minutes;
        }

        $totalDuration += $service->duration_minutes;

        return $scheduledAt->copy()->addMinutes($totalDuration);
    }
}
