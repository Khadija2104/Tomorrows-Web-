<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Support\Str;

class User extends Model implements AuthenticatableContract
{
    use Authenticatable;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    protected $fillable = [
        'name',
        'email',
        'google_id',
        'avatar',
        'role',
        'password',
    ];

    protected $hidden = [
        'remember_token',
        'password',
    ];

    public function getAuthPassword()
    {
        return $this->password;
    }

    /**
     * Get all tokens for the user
     */
    public function tokens()
    {
        return $this->morphMany(PersonalAccessToken::class, 'tokenable');
    }

    /**
     * Create a new personal access token for the user
     */
    public function createToken(string $name, array $abilities = ['*'])
    {
        $plainTextToken = Str::random(40);
        
        $token = PersonalAccessToken::create([
            'tokenable_type' => self::class,
            'tokenable_id' => $this->_id,
            'name' => $name,
            'token' => hash('sha256', $plainTextToken),
            'abilities' => $abilities,
        ]);

        return (object) [
            'accessToken' => $token,
            'plainTextToken' => $token->_id . '|' . $plainTextToken,
        ];
    }

    /**
     * Get current access token
     */
    public function currentAccessToken()
    {
        return $this->accessToken ?? null;
    }
}