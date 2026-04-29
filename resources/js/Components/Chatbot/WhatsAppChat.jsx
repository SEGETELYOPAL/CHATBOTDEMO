import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import ChatMessage from './ChatMessage';

export default function WhatsAppChat({ initialProducts = [], fullscreenOnMobile = true }) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [products, setProducts] = useState(initialProducts);
    const endRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const welcomeMessage = useMemo(
        () => ({
            id: Date.now(),
            sender: 'bot',
            text: "¡Hola! 👋 Soy tu asistente virtual. Escribe 'productos' para ver el catálogo disponible.",
            type: 'text',
            products: [],
            created_at: new Date(),
        }),
        []
    );

    useEffect(() => {
        setMessages([welcomeMessage]);
    }, [welcomeMessage]);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;
        container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages, isTyping]);

    const appendMessage = (message) => setMessages((prev) => [...prev, message]);

    const sendMessage = async (customText = null) => {
        const rawText = customText ?? inputValue;
        const text = rawText.trim();

        if (!text) return;

        appendMessage({
            id: Date.now(),
            sender: 'user',
            text,
            type: 'text',
            products: [],
            created_at: new Date(),
        });

        setInputValue('');
        setIsTyping(true);

        try {
            const { data } = await axios.post('/demo-chatbot/reply', { message: text });
            setProducts(data.products ?? products);

            appendMessage({
                id: Date.now() + 1,
                sender: 'bot',
                text: data.reply,
                type: data.type,
                products: data.products ?? [],
                created_at: new Date(),
            });
        } catch (error) {
            appendMessage({
                id: Date.now() + 2,
                sender: 'bot',
                text: 'Hubo un problema respondiendo. Intenta nuevamente.',
                type: 'text',
                products: [],
                created_at: new Date(),
            });
        } finally {
            setIsTyping(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        sendMessage();
    };

    const handleInterest = (product) => {
        const userMessage = `Me interesa el producto: ${product.name}`;

        appendMessage({
            id: Date.now(),
            sender: 'user',
            text: userMessage,
            type: 'text',
            products: [],
            created_at: new Date(),
        });

        appendMessage({
            id: Date.now() + 1,
            sender: 'bot',
            text: `Perfecto, te puedo ayudar con más información sobre ${product.name}. En una integración real aquí se conectaría con un asesor o WhatsApp Business API.`,
            type: 'text',
            products: [],
            created_at: new Date(),
        });
    };

    return (
        <div
            className={`flex flex-col overflow-hidden border border-gray-200 bg-[#efeae2] shadow-2xl ${
                fullscreenOnMobile
                    ? 'h-[100dvh] w-screen md:h-auto md:w-full md:max-w-md md:rounded-3xl'
                    : 'mx-auto w-full max-w-md rounded-3xl'
            }`}
        >
            <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-200 font-bold text-emerald-900">
                    AV
                </div>
                <div>
                    <p className="text-sm font-semibold">Asistente Virtual</p>
                    <p className="text-xs text-emerald-100">En línea</p>
                </div>
            </div>

            <div ref={messagesContainerRef} className="flex-1 space-y-3 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_45%)] p-4 md:h-[28rem] md:flex-none">
                {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} onInterest={handleInterest} />
                ))}

                {isTyping && (
                    <div className="text-xs text-gray-500">Asistente está escribiendo...</div>
                )}

                <div ref={endRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-gray-200 bg-white p-3">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    autoFocus={false}
                    placeholder="Escribe un mensaje..."
                    className="w-full rounded-full border border-gray-300 px-4 py-2 text-base focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 md:text-sm"
                />
                <button
                    type="submit"
                    className="h-10 w-10 rounded-full bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                    ➤
                </button>
            </form>
        </div>
    );
}
