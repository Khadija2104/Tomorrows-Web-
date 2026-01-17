<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FoodItem;
use Illuminate\Http\Request;

class FoodItemController extends Controller
{
    public function index(Request $request)
    {
        $query = FoodItem::where('is_active', true);

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $items = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }

    public function show($id)
    {
        $item = FoodItem::find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Food item not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $item
        ]);
    }

    public function getByCategory($category)
    {
        $items = FoodItem::where('is_active', true)
            ->where('category', $category)
            ->get();

        return response()->json([
            'success' => true,
            'category' => $category,
            'data' => $items
        ]);
    }
}