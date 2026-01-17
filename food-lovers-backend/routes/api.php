<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FoodItemController;
use App\Http\Controllers\Api\EmailAuthController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\FoodItemController as AdminFoodItemController;
use Illuminate\Support\Facades\Route;

// Authentication Routes (Public)
Route::prefix('auth')->group(function () {
    Route::post('register', [EmailAuthController::class, 'register']);
    Route::post('login', [EmailAuthController::class, 'login']);
    Route::get('google', [AuthController::class, 'redirectToGoogle']);
    Route::get('google/callback', [AuthController::class, 'handleGoogleCallback']);
});

// Public Food Items Routes
Route::prefix('food-items')->group(function () {
    Route::get('/', [FoodItemController::class, 'index']);
    Route::get('/{id}', [FoodItemController::class, 'show']);
    Route::get('/category/{category}', [FoodItemController::class, 'getByCategory']);
});

// Protected Routes (Require Authentication)
Route::middleware('auth.token')->group(function () {
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('auth/logout', [AuthController::class, 'logout']);

    // Admin Routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::apiResource('food-items', AdminFoodItemController::class);
        Route::get('users', [App\Http\Controllers\Admin\UserController::class, 'index']);
        Route::put('users/{id}/role', [App\Http\Controllers\Admin\UserController::class, 'updateRole']);
        Route::delete('users/{id}', [App\Http\Controllers\Admin\UserController::class, 'destroy']);
    });
});