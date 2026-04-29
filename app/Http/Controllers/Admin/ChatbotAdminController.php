<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatbotFlow;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChatbotAdminController extends Controller
{
    public function dashboard(Request $request): Response
    {
        return Inertia::render('Dashboard', [
            'products' => Product::query()->latest()->get(),
            'flows' => ChatbotFlow::query()->orderBy('priority')->get(),
            'status' => $request->session()->get('status'),
        ]);
    }

    public function storeProduct(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'image' => ['nullable', 'string', 'max:2048'],
            'stock' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ]);

        Product::create($data);

        return back()->with('status', 'Producto creado correctamente.');
    }

    public function updateProduct(Request $request, Product $product): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'image' => ['nullable', 'string', 'max:2048'],
            'stock' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ]);

        $product->update($data);

        return back()->with('status', 'Producto actualizado correctamente.');
    }

    public function deleteProduct(Product $product): RedirectResponse
    {
        $product->delete();

        return back()->with('status', 'Producto eliminado correctamente.');
    }

    public function storeFlow(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'keywords' => ['required', 'string', 'max:1000'],
            'reply' => ['required', 'string', 'max:2000'],
            'type' => ['required', 'in:text,products'],
            'priority' => ['required', 'integer', 'min:1'],
            'is_active' => ['required', 'boolean'],
        ]);

        ChatbotFlow::create([
            'name' => $data['name'],
            'keywords' => $this->normalizeKeywords($data['keywords']),
            'reply' => $data['reply'],
            'type' => $data['type'],
            'priority' => $data['priority'],
            'is_active' => $data['is_active'],
        ]);

        return back()->with('status', 'Flujo creado correctamente.');
    }

    public function updateFlow(Request $request, ChatbotFlow $flow): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'keywords' => ['required', 'string', 'max:1000'],
            'reply' => ['required', 'string', 'max:2000'],
            'type' => ['required', 'in:text,products'],
            'priority' => ['required', 'integer', 'min:1'],
            'is_active' => ['required', 'boolean'],
        ]);

        $flow->update([
            'name' => $data['name'],
            'keywords' => $this->normalizeKeywords($data['keywords']),
            'reply' => $data['reply'],
            'type' => $data['type'],
            'priority' => $data['priority'],
            'is_active' => $data['is_active'],
        ]);

        return back()->with('status', 'Flujo actualizado correctamente.');
    }

    public function deleteFlow(ChatbotFlow $flow): RedirectResponse
    {
        $flow->delete();

        return back()->with('status', 'Flujo eliminado correctamente.');
    }

    private function normalizeKeywords(string $keywords): array
    {
        return collect(explode(',', $keywords))
            ->map(fn ($keyword) => trim(mb_strtolower($keyword)))
            ->filter()
            ->values()
            ->all();
    }
}
