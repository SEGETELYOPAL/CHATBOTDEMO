<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatbotFlow extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'keywords',
        'reply',
        'type',
        'is_active',
        'priority',
    ];

    protected $casts = [
        'keywords' => 'array',
        'is_active' => 'boolean',
    ];
}
