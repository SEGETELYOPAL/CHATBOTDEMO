<?php

namespace App\Http\Controllers;

use App\Models\ChatbotFlow;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChatbotDemoController extends Controller
{
    public function landing(): Response
    {
        return Inertia::render('ChatbotDemo/Landing', [
            'products' => $this->activeProducts(),
        ]);
    }

    public function chat(): Response
    {
        return Inertia::render('ChatbotDemo/Chat', [
            'products' => $this->activeProducts(),
        ]);
    }

    public function reply(Request $request)
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
        ]);

        $message = mb_strtolower(trim($validated['message']));
        $products = $this->activeProducts();
        $flow = $this->matchFlow($message);

        if ($flow) {
            return response()->json([
                'reply' => $flow->reply,
                'type' => $flow->type,
                'products' => $flow->type === 'products' ? $products : [],
            ]);
        }

        return response()->json([
            'reply' => "Entiendo. Por ahora soy un bot demo, pero puedo mostrarte productos disponibles. Escribe 'productos' para ver el catalogo.",
            'type' => 'text',
            'products' => [],
        ]);
    }

    private function activeProducts()
    {
        return Product::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'description', 'price', 'image', 'stock']);
    }

    private function containsAny(string $message, array $keywords): bool
    {
        foreach ($keywords as $keyword) {
            if (str_contains($message, mb_strtolower($keyword))) {
                return true;
            }
        }

        return false;
    }

    private function matchFlow(string $message): ?ChatbotFlow
    {
        $flows = ChatbotFlow::query()
            ->where('is_active', true)
            ->orderBy('priority')
            ->get();

        foreach ($flows as $flow) {
            $keywords = is_array($flow->keywords) ? $flow->keywords : [];

            if ($this->containsAny($message, $keywords)) {
                return $flow;
            }
        }

        return null;
    }
}
