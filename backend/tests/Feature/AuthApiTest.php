<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_with_valid_data()
    {
        $payload = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'message',
                     'data' => [
                         'user' => ['id', 'name', 'email'],
                         'access_token',
                         'token_type'
                     ]
                 ]);
        
        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
    }

    public function test_user_cannot_register_with_existing_email()
    {
        User::factory()->create(['email' => 'john@example.com']);

        $payload = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors('email');
    }

    public function test_user_cannot_register_with_password_mismatch()
    {
        $payload = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'wrongpassword',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors('password');
    }

    public function test_user_can_login_with_correct_credentials()
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123')
        ]);

        $payload = [
            'email' => $user->email,
            'password' => 'password123',
        ];

        $response = $this->postJson('/api/login', $payload);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'message',
                     'data' => [
                         'user',
                         'access_token',
                         'token_type'
                     ]
                 ]);
    }

    public function test_user_cannot_login_with_incorrect_password()
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123')
        ]);

        $payload = [
            'email' => $user->email,
            'password' => 'wrongpassword',
        ];

        $response = $this->postJson('/api/login', $payload);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors('email');
    }

    public function test_authenticated_user_can_access_protected_route()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/user');

        $response->assertStatus(200)
                 ->assertJsonPath('email', $user->email);
    }

    public function test_unauthenticated_user_cannot_access_protected_route()
    {
        $response = $this->getJson('/api/user');

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_logout()
    {
        $user = User::factory()->create();

        // This simulates a logged in user with a Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/logout');

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Logged out successfully']);
        
        $this->assertCount(0, $user->tokens);
    }
}
