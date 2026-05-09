<?php

namespace App\Http\Controllers;

use App\Models\Saved_city;
use Illuminate\Http\Request;

class SavedCityController extends Controller
{
    /**
     * Display a listing of saved cities
     */
    public function index()
    {
        $cities = Saved_city::latest()->get();

        return response()->json($cities);
    }

    /**
     * Store a new city
     */
    public function store(Request $request)
    {
        $request->validate([
            'city_name' => 'required|string|max:255',
            'country_code' => 'required|string|max:255',
        ]);

        $city = Saved_city::create([
            'city_name' => $request->city_name,
            'country_code' => $request->country_code,
            'Added_at' => now(),
        ]);

        return response()->json([
            'message' => 'City saved successfully',
            'data' => $city
        ]);
    }

    /**
     * Show single city
     */
    public function show(string $id)
    {
        $city = Saved_city::findOrFail($id);

        return response()->json($city);
    }

    /**
     * Update city
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'city_name' => 'required|string|max:255',
        ]);

        $city = Saved_city::findOrFail($id);

        $city->update([
            'city_name' => $request->city_name,
        ]);

        return response()->json([
            'message' => 'City updated successfully',
            'data' => $city
        ]);
    }

    /**
     * Delete city
     */
    public function destroy(string $id)
    {
        $city = Saved_city::findOrFail($id);
        $city->delete();

        return response()->json([
            'message' => 'City deleted successfully'
        ]);
    }
}
