import { Head, Link } from '@inertiajs/react';
import WhatsAppChat from '@/Components/Chatbot/WhatsAppChat';

export default function Chat({ products }) {
    return (
        <>
            <Head title="Chatbot Demo Chat" />
            <div className="min-h-screen bg-gradient-to-b from-slate-100 via-emerald-50 to-slate-100 px-6 py-12">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Demo de chatbot</h1>
                        <Link href={route('chatbot.demo')} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                            Volver a landing
                        </Link>
                    </div>
                    <div className="flex justify-center">
                        <WhatsAppChat initialProducts={products} />
                    </div>
                </div>
            </div>
        </>
    );
}
