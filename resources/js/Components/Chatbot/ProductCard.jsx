export default function ProductCard({ product, onInterest }) {
    const price = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(product.price);

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            {product.image ? (
                <img
                    src={product.image}
                    alt={product.name}
                    className="mb-3 h-28 w-full rounded-lg object-cover"
                />
            ) : (
                <div className="mb-3 flex h-28 w-full items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-500">
                    Sin imagen
                </div>
            )}

            <h4 className="text-sm font-semibold text-gray-900">{product.name}</h4>
            <p className="mt-1 text-xs text-gray-600">{product.description}</p>
            <p className="mt-2 text-sm font-bold text-emerald-700">{price}</p>
            <p className="mt-1 text-xs text-gray-500">Stock: {product.stock}</p>

            <button
                type="button"
                onClick={() => onInterest(product)}
                className="mt-3 w-full rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-700"
            >
                Me interesa
            </button>
        </div>
    );
}
