<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FoodItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FoodItemController extends Controller
{
    public function index()
    {
        $items = FoodItem::orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $items]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|in:korean,japanese,thai,mexican,sweets,drinks',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|url',
            'ingredients' => 'nullable|array',
            'allergens' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $foodItem = FoodItem::create(array_merge($validator->validated(), ['is_active' => true]));

        return response()->json(['success' => true, 'message' => 'Food item created', 'data' => $foodItem], 201);
    }

    public function update(Request $request, $id)
    {
        $foodItem = FoodItem::find($id);

        if (!$foodItem) {
            return response()->json(['success' => false, 'message' => 'Food item not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|in:korean,japanese,thai,mexican,sweets,drinks',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'image_url' => 'nullable|url',
            'is_active' => 'sometimes|boolean',
            'ingredients' => 'nullable|array',
            'allergens' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $foodItem->update($validator->validated());

        return response()->json(['success' => true, 'message' => 'Food item updated', 'data' => $foodItem]);
    }

    public function destroy($id)
    {
        $foodItem = FoodItem::find($id);

        if (!$foodItem) {
            return response()->json(['success' => false, 'message' => 'Food item not found'], 404);
        }

        $foodItem->delete();

        return response()->json(['success' => true, 'message' => 'Food item deleted']);
    }
}