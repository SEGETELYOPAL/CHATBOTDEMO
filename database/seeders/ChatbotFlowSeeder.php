<?php

namespace Database\Seeders;

use App\Models\ChatbotFlow;
use Illuminate\Database\Seeder;

class ChatbotFlowSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $flows = [
            [
                'name' => 'Saludo inicial',
                'keywords' => ['hola', 'buenas', 'hey', 'inicio'],
                'reply' => 'Hola. Bienvenido a nuestro demo de chatbot. Soy tu asistente virtual. Quieres ver nuestros productos disponibles?',
                'type' => 'text',
                'priority' => 10,
            ],
            [
                'name' => 'Catalogo de productos',
                'keywords' => ['productos', 'catalogo', 'ver productos', 'precio'],
                'reply' => 'Claro, estos son algunos productos disponibles:',
                'type' => 'products',
                'priority' => 20,
            ],
            [
                'name' => 'Ayuda',
                'keywords' => ['ayuda', 'opciones'],
                'reply' => 'Puedo ayudarte con: ver productos, consultar precios o iniciar una conversacion comercial.',
                'type' => 'text',
                'priority' => 30,
            ],
        ];

        foreach ($flows as $flow) {
            ChatbotFlow::updateOrCreate(
                ['name' => $flow['name']],
                [
                    'keywords' => $flow['keywords'],
                    'reply' => $flow['reply'],
                    'type' => $flow['type'],
                    'is_active' => true,
                    'priority' => $flow['priority'],
                ]
            );
        }
    }
}
