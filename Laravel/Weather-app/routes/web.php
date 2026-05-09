<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SavedCityController;
use App\Http\Controllers\SearchHistoryController;

Route::get('/', function () {
    return view('welcome');
});

Route::resource('cities', SavedCityController::class);
Route::resource('search-history', SearchHistoryController::class);
