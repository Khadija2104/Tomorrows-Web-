<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;  // <-- Changed namespace!

class FoodItem extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'food_items';

    protected $fillable = [
        'name',
        'category',
        'description',
        'price',
        'image_url',
        'is_active',
        'ingredients',
        'allergens',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'ingredients' => 'array',
        'allergens' => 'array',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}