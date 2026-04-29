<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'demo@chatbot.com'],
            [
                'name' => 'Demo User',
                'password' => Hash::make('password123'),
            ]
        );

        $this->call([
            ProductSeeder::class,
            ChatbotFlowSeeder::class,
        ]);
    }
}
