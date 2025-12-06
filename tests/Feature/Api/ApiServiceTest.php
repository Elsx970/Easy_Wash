<?php

use App\Models\Service;
use App\Models\User;

test('anyone can view services list via api', function () {
    Service::factory()->count(3)->create();

    $this->getJson('/api/v1/services')
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'description', 'duration_minutes', 'price'],
            ],
        ]);
});

test('anyone can view a single service via api', function () {
    $service = Service::factory()->create();

    $this->getJson("/api/v1/services/{$service->id}")
        ->assertOk()
        ->assertJson([
            'data' => [
                'id' => $service->id,
                'name' => $service->name,
            ],
        ]);
});

test('regular users cannot create services via api', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/v1/services', [
            'name' => 'Test Service',
            'duration_minutes' => 60,
            'price' => 50000,
        ])
        ->assertForbidden();
});

test('admins can create services via api', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)
        ->postJson('/api/v1/services', [
            'name' => 'Cuci Mobil Premium',
            'description' => 'Cuci mobil dengan paket premium',
            'duration_minutes' => 120,
            'price' => 150000,
        ])
        ->assertCreated()
        ->assertJsonStructure([
            'data' => ['id', 'name', 'duration_minutes', 'price'],
        ]);

    $this->assertDatabaseHas('services', [
        'name' => 'Cuci Mobil Premium',
        'duration_minutes' => 120,
        'price' => 150000,
    ]);
});

test('service creation requires valid data', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->postJson('/api/v1/services', [])
        ->assertJsonValidationErrors(['name', 'duration_minutes', 'price']);
});

test('admins can update services via api', function () {
    $admin = User::factory()->admin()->create();
    $service = Service::factory()->create();

    $this->actingAs($admin)
        ->putJson("/api/v1/services/{$service->id}", [
            'name' => 'Updated Service Name',
            'description' => $service->description,
            'duration_minutes' => $service->duration_minutes,
            'price' => $service->price,
        ])
        ->assertOk()
        ->assertJson([
            'data' => [
                'name' => 'Updated Service Name',
            ],
        ]);

    $this->assertDatabaseHas('services', [
        'id' => $service->id,
        'name' => 'Updated Service Name',
    ]);
});

test('admins can delete services via api', function () {
    $admin = User::factory()->admin()->create();
    $service = Service::factory()->create();

    $this->actingAs($admin)
        ->deleteJson("/api/v1/services/{$service->id}")
        ->assertOk()
        ->assertJson(['message' => 'Layanan berhasil dihapus.']);

    $this->assertDatabaseMissing('services', [
        'id' => $service->id,
    ]);
});

test('regular users cannot update services via api', function () {
    $user = User::factory()->create();
    $service = Service::factory()->create();

    $this->actingAs($user)
        ->putJson("/api/v1/services/{$service->id}", [
            'name' => 'Updated Name',
            'duration_minutes' => 60,
            'price' => 50000,
        ])
        ->assertForbidden();
});

test('regular users cannot delete services via api', function () {
    $user = User::factory()->create();
    $service = Service::factory()->create();

    $this->actingAs($user)
        ->deleteJson("/api/v1/services/{$service->id}")
        ->assertForbidden();
});
