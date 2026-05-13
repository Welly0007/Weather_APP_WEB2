<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Saved_city;

class CityFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_save_city()
    {
        $payload = [
            'city_name' => 'Rome',
            'country_code' => 'IT',
        ];
        $response = $this->postJson('/api/cities', $payload);
        $response->assertStatus(201)->assertJsonStructure(['message', 'data']);
        $this->assertDatabaseHas('saved_cities', [
            'city_name' => 'Rome',
            'country_code' => 'IT',
        ]);
    }

    public function test_can_delete_city()
    {
        $city = Saved_city::create([
            'city_name' => 'Paris',
            'country_code' => 'FR',
            'Added_at' => now()->toDateString(),
        ]);
        $this->assertDatabaseHas('saved_cities', ['city_name' => 'Paris']);
        $response = $this->deleteJson('/api/cities/' . $city->id);
        $response->assertStatus(200);
        $this->assertDatabaseMissing('saved_cities', ['city_name' => 'Paris']);
    }

    public function test_city_name_is_required()
    {
        $payload = [
            'city_name' => '',
            'country_code' => 'US',
        ];
        $response = $this->postJson('/api/cities', $payload);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors('city_name');
    }
}