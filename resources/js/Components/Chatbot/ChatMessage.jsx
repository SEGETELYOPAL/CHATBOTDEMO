import ProductCard from './ProductCard';

function formatTime(value) {
    return new Date(value).toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function ChatMessage({ message, onInterest }) {
    const isUser = message.sender === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 shadow ${
                    isUser
                        ? 'rounded-br-md bg-emerald-500 text-white'
                        : 'rounded-bl-md bg-white text-gray-800'
                }`}
            >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>

                {message.type === 'products' && message.products?.length > 0 && (
                    <div className="mt-3 space-y-2">
                        {message.products.map((product) => (
                            <ProductCard key={product.id} product={product} onInterest={onInterest} />
                        ))}
                    </div>
                )}

                <div
                    className={`mt-1 flex items-center gap-1 text-[10px] ${
                        isUser ? 'justify-end text-emerald-100' : 'justify-end text-gray-400'
                    }`}
                >
                    <span>{formatTime(message.created_at)}</span>
                    {isUser && <span>✓✓</span>}
                </div>
            </div>
        </div>
    );
}
