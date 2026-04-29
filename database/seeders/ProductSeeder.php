<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Camiseta Premium',
                'description' => 'Camiseta urbana de alta calidad',
                'price' => 161900,
                'stock' => 20,
            ],
            [
                'name' => 'Gorra REM',
                'description' => 'Gorra ajustable para eventos y uso diario',
                'price' => 89900,
                'stock' => 15,
            ],
            [
                'name' => 'Hoodie Oversize',
                'description' => 'Buzo oversize comodo y moderno',
                'price' => 219900,
                'stock' => 10,
            ],
            [
                'name' => 'Abanico Oficial',
                'description' => 'Abanico para eventos y festivales',
                'price' => 49900,
                'stock' => 30,
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['name' => $product['name']],
                [
                    'description' => $product['description'],
                    'price' => $product['price'],
                    'image' => null,
                    'stock' => $product['stock'],
                    'is_active' => true,
                ]
            );
        }
    }
}
