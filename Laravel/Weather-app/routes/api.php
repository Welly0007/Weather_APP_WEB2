<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WeatherController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


//Route::post('/Weather', [WeatherController::class, 'getWeather']);
Route::get('/weather', [WeatherController::class, 'getWeather'])
    ->name('weather.getWeather');
