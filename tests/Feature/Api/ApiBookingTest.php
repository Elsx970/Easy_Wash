<?php

use App\BookingStatus;
use App\Models\Booking;
use App\Models\Service;
use App\Models\User;

test('unauthenticated users cannot access bookings api', function () {
    $this->getJson('/api/v1/bookings')
        ->assertUnauthorized();
});

test('authenticated users can view their bookings via api', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->getJson('/api/v1/bookings')
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'vehicle_type', 'vehicle_plate', 'status', 'service'],
            ],
        ]);
});

test('users can create a booking via api', function () {
    $user = User::factory()->create();
    $service = Service::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/api/v1/bookings', [
            'service_id' => $service->id,
            'vehicle_type' => 'motor',
            'vehicle_plate' => 'B1234ABC',
            'scheduled_at' => now()->addDay()->format('Y-m-d\TH:i'),
        ])
        ->assertCreated()
        ->assertJsonStructure([
            'data' => ['id', 'vehicle_type', 'vehicle_plate', 'status'],
        ]);

    $this->assertDatabaseHas('bookings', [
        'user_id' => $user->id,
        'service_id' => $service->id,
        'vehicle_type' => 'motor',
        'vehicle_plate' => 'B1234ABC',
        'status' => BookingStatus::Pending->value,
    ]);
});

test('booking api requires valid service', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/v1/bookings', [
            'service_id' => 99999,
            'vehicle_type' => 'motor',
            'vehicle_plate' => 'B1234ABC',
            'scheduled_at' => now()->addDay()->format('Y-m-d\TH:i'),
        ])
        ->assertJsonValidationErrors('service_id');
});

test('users can view their own booking via api', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->getJson("/api/v1/bookings/{$booking->id}")
        ->assertOk()
        ->assertJson([
            'data' => [
                'id' => $booking->id,
                'vehicle_plate' => $booking->vehicle_plate,
            ],
        ]);
});

test('users cannot view other users bookings via api', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $booking = Booking::factory()->create(['user_id' => $otherUser->id]);

    $this->actingAs($user)
        ->getJson("/api/v1/bookings/{$booking->id}")
        ->assertForbidden();
});

test('admins can view all bookings via api', function () {
    $admin = User::factory()->admin()->create();
    $booking = Booking::factory()->create();

    $this->actingAs($admin)
        ->getJson("/api/v1/bookings/{$booking->id}")
        ->assertOk();
});

test('admins can update booking status via api', function () {
    $admin = User::factory()->admin()->create();
    $booking = Booking::factory()->create();

    $this->actingAs($admin)
        ->putJson("/api/v1/bookings/{$booking->id}", [
            'status' => BookingStatus::InProgress->value,
        ])
        ->assertOk()
        ->assertJson([
            'data' => [
                'status' => BookingStatus::InProgress->value,
            ],
        ]);

    $this->assertDatabaseHas('bookings', [
        'id' => $booking->id,
        'status' => BookingStatus::InProgress->value,
    ]);
});

test('users can delete their own pending bookings via api', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->create([
        'user_id' => $user->id,
        'status' => BookingStatus::Pending->value,
    ]);

    $this->actingAs($user)
        ->deleteJson("/api/v1/bookings/{$booking->id}")
        ->assertOk();

    $this->assertDatabaseMissing('bookings', [
        'id' => $booking->id,
    ]);
});

test('queue endpoint returns pending and in progress bookings', function () {
    $user = User::factory()->create();
    Booking::factory()->create(['status' => BookingStatus::Pending->value]);
    Booking::factory()->create(['status' => BookingStatus::InProgress->value]);
    Booking::factory()->create(['status' => BookingStatus::Completed->value]);

    $response = $this->actingAs($user)
        ->getJson('/api/v1/bookings/queue/live')
        ->assertOk();

    $data = $response->json('data');
    expect(count($data))->toBe(2);
});
