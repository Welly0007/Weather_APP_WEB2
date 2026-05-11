<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class WeatherService
{
    public function getWeather($city)
    {
        //$apiKey = env('WEATHERAPI_KEY');
        $apiKey = config('services.weatherapi.key');

        $response = Http::get("https://api.weatherapi.com/v1/forecast.json", [
            'q' => $city,
            'key' => $apiKey,
            'days' => 3,
            'aqi'  => "no",
            'alerts' => "no",
        ]);

        if ($response->failed()) {
            return null;
        }

        return $response->json();
    }
}
