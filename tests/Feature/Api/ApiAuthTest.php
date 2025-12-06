<?php

use App\Models\User;

test('users can login via api', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'test@example.com',
        'password' => 'password',
    ])
        ->assertOk()
        ->assertJsonStructure([
            'message',
            'user' => ['id', 'name', 'email', 'role'],
        ]);

    expect($response->json('user.email'))->toBe('test@example.com');
});

test('login fails with invalid credentials', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);

    $this->postJson('/api/login', [
        'email' => 'test@example.com',
        'password' => 'wrong-password',
    ])
        ->assertJsonValidationErrors('email');
});

test('login requires email and password', function () {
    $this->postJson('/api/login', [])
        ->assertJsonValidationErrors(['email', 'password']);
});

test('authenticated users can get their user info via api', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/user')
        ->assertOk()
        ->assertJsonStructure([
            'user' => ['id', 'name', 'email', 'role'],
        ])
        ->assertJson([
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
            ],
        ]);
});

test('unauthenticated users cannot get user info', function () {
    $this->getJson('/api/user')
        ->assertUnauthorized();
});

test('users can logout via api', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/logout')
        ->assertOk()
        ->assertJson(['message' => 'Logout berhasil.']);

    $this->assertGuest();
});

test('unauthenticated users cannot logout', function () {
    $this->postJson('/api/logout')
        ->assertUnauthorized();
});

test('users can register via api', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])
        ->assertCreated()
        ->assertJsonStructure([
            'data' => ['id', 'name', 'email', 'role'],
        ]);

    expect($response->json('data.email'))->toBe('test@example.com');
    expect($response->json('data.role'))->toBe('user');

    $this->assertDatabaseHas('users', [
        'email' => 'test@example.com',
        'role' => 'user',
    ]);
});

test('registration requires valid data', function () {
    $this->postJson('/api/register', [])
        ->assertJsonValidationErrors(['name', 'email', 'password']);
});

test('registration requires unique email', function () {
    User::factory()->create(['email' => 'test@example.com']);

    $this->postJson('/api/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])
        ->assertJsonValidationErrors('email');
});

test('registration requires password confirmation', function () {
    $this->postJson('/api/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'different-password',
    ])
        ->assertJsonValidationErrors('password');
});
