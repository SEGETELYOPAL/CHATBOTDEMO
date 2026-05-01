<?php

namespace App\Http\Controllers;

use App\Models\ChatbotFlow;
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
        $value = $request->input('entry.0.changes.0.value', []);
        $messages = $value['messages'] ?? [];

        if (empty($messages)) {
            return response()->json(['ok' => true]);
        }

        $message = $messages[0] ?? [];
        $from = $message['from'] ?? null;
        $text = trim((string) data_get($message, 'text.body', ''));

        if (!$from || $text === '') {
            return response()->json(['ok' => true]);
        }

        $reply = $this->buildReply($text);
        $this->sendTextMessage($from, $reply);

        return response()->json(['ok' => true]);
    }

    private function buildReply(string $incomingText): string
    {
        $message = mb_strtolower($incomingText);

        $flows = ChatbotFlow::query()
            ->where('is_active', true)
            ->orderBy('priority')
            ->get(['keywords', 'reply']);

        foreach ($flows as $flow) {
            $keywords = is_array($flow->keywords) ? $flow->keywords : [];

            foreach ($keywords as $keyword) {
                if ($keyword !== '' && str_contains($message, mb_strtolower((string) $keyword))) {
                    return $flow->reply;
                }
            }
        }

        return "Entiendo. Soy tu bot de WhatsApp demo. Escribe 'productos' para continuar.";
    }

    private function sendTextMessage(string $to, string $body): void
    {
        $token = (string) config('services.whatsapp.token');
        $phoneNumberId = (string) config('services.whatsapp.phone_number_id');

        if ($token === '' || $phoneNumberId === '') {
            Log::warning('WhatsApp config incompleta: token o phone_number_id faltante.');
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
            Log::error('Error enviando mensaje a WhatsApp', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);
        }
    }
}
