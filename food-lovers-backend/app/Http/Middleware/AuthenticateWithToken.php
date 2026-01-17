<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\PersonalAccessToken;

class AuthenticateWithToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        // Parse token (format: {id}|{plainTextToken})
        $tokenParts = explode('|', $token, 2);
        
        if (count($tokenParts) !== 2) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid token format'
            ], 401);
        }

        [$id, $plainTextToken] = $tokenParts;

        // Find token in database
        $accessToken = PersonalAccessToken::find($id);

        if (!$accessToken || hash('sha256', $plainTextToken) !== $accessToken->token) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid token'
            ], 401);
        }

        // Get user
        $user = User::find($accessToken->tokenable_id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 401);
        }

        // Attach user and token to request
        $request->merge(['user' => $user]);
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        $user->accessToken = $accessToken;

        return $next($request);
    }
}