<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WeatherController;
use App\Http\Controllers\SavedCityController;
Route::apiResource('cities', SavedCityController::class);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


//Route::post('/Weather', [WeatherController::class, 'getWeather']);
Route::post('/weather', [WeatherController::class, 'index'])
    ->name('weather.index');
