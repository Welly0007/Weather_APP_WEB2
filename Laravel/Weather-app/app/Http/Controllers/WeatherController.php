<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\WeatherService;

class WeatherController extends Controller
{
    protected $weatherService;

    public function __construct(WeatherService $weatherService)
    {
        $this->weatherService = $weatherService;
    }

    public function getWeather(Request $request)
    {

        $request->validate([
            'city' => 'required|string'
        ]);

        $city = $request->input('city');

        $data = $this->weatherService->getWeather($city);

        if (!$data) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unable to fetch weather'
            ], 500);
        }

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }
}
