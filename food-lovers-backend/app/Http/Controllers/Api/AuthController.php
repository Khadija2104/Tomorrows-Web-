<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::updateOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'role' => 'user',
                ]
            );

            $token = $user->createToken('auth-token')->plainTextToken;

            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect("$frontendUrl/auth/callback?token=$token&user=" . urlencode(json_encode($user)));

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to authenticate',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function me(Request $request)
{
    return response()->json([
        'success' => true,
        'data' => $request->user()
    ]);
}

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}