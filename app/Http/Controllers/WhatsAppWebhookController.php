<?php

namespace App\Http\Controllers;

use App\Models\ChatbotFlow;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppWebhookController extends Controller
{
    public function verify(Request $request)
    {
        $mode = $request->query('hub_mode', $request->query('hub.mode'));
        $verifyToken = $request->query('hub_verify_token', $request->query('hub.verify_token'));
        $challenge = $request->query('hub_challenge', $request->query('hub.challenge'));

        \Log::info('WA verify debug', [
            'mode' => $mode,
            'incoming_token' => $verifyToken,
            'env_token' => config('services.whatsapp.verify_token'),
        ]);

        if ($mode === 'subscribe' && hash_equals((string) config('services.whatsapp.verify_token'), (string) $verifyToken)) {
            return response((string) $challenge, 200)->header('Content-Type', 'text/plain');
        }

        return response('Forbidden', 403);
    }

    public function receive(Request $request): JsonResponse
    {
        \Log::info('WA receive payload', $request->all());

        $value = $request->input('entry.0.changes.0.value', []);
        $messages = $value['messages'] ?? [];

        if (empty($messages)) {
            Log::info('WA receive without messages', [
                'field' => $request->input('entry.0.changes.0.field'),
                'has_statuses' => isset($value['statuses']),
                'value' => $value,
            ]);
            return response()->json(['ok' => true]);
        }

        $message = $messages[0] ?? [];
        $type = (string) ($message['type'] ?? 'unknown');
        $from = $message['from']
            ?? data_get($value, 'contacts.0.wa_id')
            ?? $message['from_user_id']
            ?? null;
        $text = trim((string) data_get($message, 'text.body', ''));

        Log::info('WA incoming parsed', [
            'type' => $type,
            'from' => $from,
            'text' => $text,
            'message_id' => $message['id'] ?? null,
        ]);

        if ($type !== 'text') {
            Log::info('WA unsupported inbound type', ['type' => $type, 'from' => $from]);
            return response()->json(['ok' => true]);
        }

        if (!$from || $text === '') {
            return response()->json(['ok' => true]);
        }

        $flow = $this->matchFlow($text);
        $reply = $this->buildReply($flow);
        $this->sendTextMessage($from, $reply);

        return response()->json(['ok' => true]);
    }

    private function buildReply(?ChatbotFlow $flow): string
    {
        if (!$flow) {
            return "Entiendo. Soy tu bot de WhatsApp demo. Escribe 'productos' para continuar.";
        }

        if ($flow->type !== 'products') {
            return $flow->reply;
        }

        $products = Product::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->limit(5)
            ->get(['name', 'price', 'stock']);

        if ($products->isEmpty()) {
            return $flow->reply."\n\nEn este momento no hay productos disponibles.";
        }

        $lines = $products->map(function (Product $product, int $index) {
            return ($index + 1).". {$product->name} - $".number_format((float) $product->price, 2)." (stock: {$product->stock})";
        })->all();

        return trim($flow->reply)."\n\n".implode("\n", $lines);
    }

    private function matchFlow(string $incomingText): ?ChatbotFlow
    {
        $message = mb_strtolower(trim($incomingText));

        $flows = ChatbotFlow::query()
            ->where('is_active', true)
            ->orderBy('priority')
            ->get(['keywords', 'reply', 'type']);

        foreach ($flows as $flow) {
            $keywords = is_array($flow->keywords) ? $flow->keywords : [];

            foreach ($keywords as $keyword) {
                if ($keyword !== '' && str_contains($message, mb_strtolower((string) $keyword))) {
                    return $flow;
                }
            }
        }

        return null;
    }

    private function sendTextMessage(string $to, string $body): void
    {
        $token = (string) config('services.whatsapp.token');
        $phoneNumberId = (string) config('services.whatsapp.phone_number_id');

        if ($token === '' || $phoneNumberId === '') {
            \Log::warning('WhatsApp config incompleta: token o phone_number_id faltante.');
            return;
        }

        $url = "https://graph.facebook.com/v22.0/{$phoneNumberId}/messages";
        $response = Http::withToken($token)->post($url, [
            'messaging_product' => 'whatsapp',
            'to' => $to,
            'type' => 'text',
            'text' => [
                'preview_url' => false,
                'body' => $body,
            ],
        ]);

        if ($response->failed()) {
            \Log::error('Error enviando mensaje a WhatsApp', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);
        }
    }
}
