<?php

use App\BookingStatus;
use App\Models\Booking;
use App\Models\Service;
use App\Models\User;

test('guests cannot access bookings', function () {
    $this->get('/bookings')->assertRedirect('/login');
});

test('authenticated users can view their bookings', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get('/bookings')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Bookings/Index')
            ->has('bookings.data', 1)
        );
});

test('users can create a booking', function () {
    $user = User::factory()->create();
    $service = Service::factory()->create();

    $this->actingAs($user)
        ->post('/bookings', [
            'service_id' => $service->id,
            'vehicle_type' => 'motor',
            'vehicle_plate' => 'B1234ABC',
            'scheduled_at' => now()->addDay()->format('Y-m-d\TH:i'),
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('bookings', [
        'user_id' => $user->id,
        'service_id' => $service->id,
        'vehicle_type' => 'motor',
        'vehicle_plate' => 'B1234ABC',
        'status' => BookingStatus::Pending->value,
    ]);
});

test('booking requires valid service', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/bookings', [
            'service_id' => 99999,
            'vehicle_type' => 'motor',
            'vehicle_plate' => 'B1234ABC',
            'scheduled_at' => now()->addDay()->format('Y-m-d\TH:i'),
        ])
        ->assertSessionHasErrors('service_id');
});

test('booking scheduled time must be in the future', function () {
    $user = User::factory()->create();
    $service = Service::factory()->create();

    $this->actingAs($user)
        ->post('/bookings', [
            'service_id' => $service->id,
            'vehicle_type' => 'motor',
            'vehicle_plate' => 'B1234ABC',
            'scheduled_at' => now()->subDay()->format('Y-m-d\TH:i'),
        ])
        ->assertSessionHasErrors('scheduled_at');
});

test('users can view their own booking', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get("/bookings/{$booking->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Bookings/Show')
            ->where('booking.id', $booking->id)
        );
});

test('users cannot view other users bookings', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $booking = Booking::factory()->create(['user_id' => $otherUser->id]);

    $this->actingAs($user)
        ->get("/bookings/{$booking->id}")
        ->assertForbidden();
});

test('admins can view all bookings', function () {
    $admin = User::factory()->admin()->create();
    $booking = Booking::factory()->create();

    $this->actingAs($admin)
        ->get("/bookings/{$booking->id}")
        ->assertOk();
});

test('admins can update booking status', function () {
    $admin = User::factory()->admin()->create();
    $booking = Booking::factory()->create();

    $this->actingAs($admin)
        ->put("/bookings/{$booking->id}", [
            'status' => BookingStatus::InProgress->value,
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('bookings', [
        'id' => $booking->id,
        'status' => BookingStatus::InProgress->value,
    ]);
});
