import { Head, Link } from '@inertiajs/react';
import WhatsAppChat from '@/Components/Chatbot/WhatsAppChat';

export default function Chat({ products }) {
    return (
        <>
            <Head title="Chatbot Demo Chat" />
            <div className="relative h-[100dvh] w-screen overflow-hidden bg-gradient-to-b from-slate-100 via-emerald-50 to-slate-100 md:min-h-screen md:px-6 md:py-12">
                <div className="absolute right-4 top-4 z-10 md:hidden">
                    <Link href={route('chatbot.demo')} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                        Volver a landing
                    </Link>
                </div>
                <div className="mx-auto h-full w-full md:max-w-5xl">
                    <div className="hidden items-center justify-between md:mb-6 md:flex">
                        <h1 className="text-2xl font-bold">Demo de chatbot</h1>
                        <Link href={route('chatbot.demo')} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                            Volver a landing
                        </Link>
                    </div>

                    <div className="h-full md:flex md:justify-center md:h-auto">
                        <WhatsAppChat initialProducts={products} />
                    </div>
                </div>
            </div>
        </>
    );
}
