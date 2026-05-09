<?php

namespace App\Http\Controllers;

use App\Models\Search_History;
use Illuminate\Http\Request;

class SearchHistoryController extends Controller
{
    /**
     * Display a listing of search history
     */
    public function index()
    {
        $histories = Search_History::latest()->get();

        return response()->json($histories);
    }

    /**
     * Store a new search history entry
     */
    public function store(Request $request)
    {
        $request->validate([
            'city_name' => 'required|string|max:255',
        ]);

        $history = Search_History::create([
            'city_name' => $request->city_name,
            'searched_at' => now(),
        ]);

        return response()->json([
            'message' => 'Search history entry saved successfully',
            'data' => $history
        ]);
    }

    /**
     * Show single search history entry
     */
    public function show(string $id)
    {
        $history = Search_History::findOrFail($id);

        return response()->json($history);
    }

    /**
     * Update search history entry
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'city_name' => 'required|string|max:255',
        ]);

        $history = Search_History::findOrFail($id);

        $history->update([
            'city_name' => $request->city_name,
        ]);

        return response()->json([
            'message' => 'Search history entry updated successfully',
            'data' => $history
        ]);
    }

    /**
     * Delete search history entry
     */
    public function destroy(string $id)
    {
        $history = Search_History::findOrFail($id);
        $history->delete();

        return response()->json([
            'message' => 'Search history entry deleted successfully'
        ]);
    }

    /**
    * Clear all search history entries
    */
    public function clear()
    {
        Search_History::truncate();

        return response()->json([
            'message' => 'All search history entries cleared successfully'
        ]);
    }
}
