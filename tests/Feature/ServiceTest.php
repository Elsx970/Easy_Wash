<?php

use App\Models\Service;
use App\Models\User;

test('guests cannot access services', function () {
    $this->get('/services')->assertRedirect('/login');
});

test('regular users cannot access services', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/services')
        ->assertForbidden();
});

test('admins can view services', function () {
    $admin = User::factory()->admin()->create();
    Service::factory()->count(3)->create();

    $this->actingAs($admin)
        ->get('/services')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Services/Index')
            ->has('services.data', 3)
        );
});

test('admins can create services', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post('/services', [
            'name' => 'Cuci Mobil Premium',
            'description' => 'Cuci mobil dengan paket premium',
            'duration_minutes' => 120,
            'price' => 150000,
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('services', [
        'name' => 'Cuci Mobil Premium',
        'duration_minutes' => 120,
        'price' => 150000,
    ]);
});

test('service creation requires valid data', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post('/services', [])
        ->assertSessionHasErrors(['name', 'duration_minutes', 'price']);
});

test('admins can update services', function () {
    $admin = User::factory()->admin()->create();
    $service = Service::factory()->create();

    $this->actingAs($admin)
        ->put("/services/{$service->id}", [
            'name' => 'Updated Service Name',
            'duration_minutes' => $service->duration_minutes,
            'price' => $service->price,
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('services', [
        'id' => $service->id,
        'name' => 'Updated Service Name',
    ]);
});

test('admins can delete services', function () {
    $admin = User::factory()->admin()->create();
    $service = Service::factory()->create();

    $this->actingAs($admin)
        ->delete("/services/{$service->id}")
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('services', [
        'id' => $service->id,
    ]);
});
