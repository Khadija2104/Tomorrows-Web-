<?php

namespace Database\Seeders;

use App\Models\FoodItem;
use Illuminate\Database\Seeder;

class FoodItemSeeder extends Seeder
{
    public function run()
    {
        FoodItem::create(['name' => 'Bibimbap', 'category' => 'korean', 'price' => 12.99, 'description' => 'Mixed rice bowl', 'is_active' => true]);
        FoodItem::create(['name' => 'Kimchi Stew', 'category' => 'korean', 'price' => 10.99, 'description' => 'Spicy stew', 'is_active' => true]);
        FoodItem::create(['name' => 'Sushi Platter', 'category' => 'japanese', 'price' => 18.99, 'description' => 'Fresh sushi', 'is_active' => true]);
        FoodItem::create(['name' => 'Pad Thai', 'category' => 'thai', 'price' => 11.99, 'description' => 'Noodles', 'is_active' => true]);
        FoodItem::create(['name' => 'Tacos', 'category' => 'mexican', 'price' => 9.99, 'description' => 'Beef tacos', 'is_active' => true]);
        FoodItem::create(['name' => 'Chocolate Cake', 'category' => 'sweets', 'price' => 7.99, 'description' => 'Dessert', 'is_active' => true]);
        FoodItem::create(['name' => 'Smoothie', 'category' => 'drinks', 'price' => 5.99, 'description' => 'Fresh juice', 'is_active' => true]);
    }
}