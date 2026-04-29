import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

const defaultProduct = {
    name: '',
    description: '',
    price: '',
    image: '',
    stock: 0,
    is_active: true,
};

const defaultFlow = {
    name: '',
    keywords: '',
    reply: '',
    type: 'text',
    priority: 100,
    is_active: true,
};

export default function Dashboard({ auth, products, flows, status }) {
    const [newProduct, setNewProduct] = useState(defaultProduct);
    const [newFlow, setNewFlow] = useState(defaultFlow);

    const submitProduct = (event) => {
        event.preventDefault();
        router.post(route('admin.products.store'), newProduct, {
            onSuccess: () => setNewProduct(defaultProduct),
        });
    };

    const submitFlow = (event) => {
        event.preventDefault();
        router.post(route('admin.flows.store'), newFlow, {
            onSuccess: () => setNewFlow(defaultFlow),
        });
    };

    const updateProduct = (product) => {
        router.put(route('admin.products.update', product.id), product);
    };

    const deleteProduct = (productId) => {
        router.delete(route('admin.products.delete', productId));
    };

    const updateFlow = (flow) => {
        router.put(route('admin.flows.update', flow.id), {
            ...flow,
            keywords: Array.isArray(flow.keywords) ? flow.keywords.join(', ') : flow.keywords,
        });
    };

    const deleteFlow = (flowId) => {
        router.delete(route('admin.flows.delete', flowId));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Admin Chatbot</h2>}
        >
            <Head title="Admin Chatbot" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                    {status && (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                            {status}
                        </div>
                    )}

                    <div className="grid gap-8 lg:grid-cols-2">
                        <section className="rounded-xl bg-white p-5 shadow-sm">
                            <h3 className="text-lg font-semibold">Crear producto</h3>
                            <form onSubmit={submitProduct} className="mt-4 space-y-3">
                                <input className="w-full rounded border p-2" placeholder="Nombre" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                                <textarea className="w-full rounded border p-2" placeholder="Descripcion" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                                <input type="number" className="w-full rounded border p-2" placeholder="Precio" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                                <input className="w-full rounded border p-2" placeholder="URL imagen (opcional)" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
                                <input type="number" className="w-full rounded border p-2" placeholder="Stock" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} />
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" checked={newProduct.is_active} onChange={(e) => setNewProduct({ ...newProduct, is_active: e.target.checked })} />
                                    Activo
                                </label>
                                <button className="rounded bg-emerald-600 px-4 py-2 text-white">Guardar producto</button>
                            </form>
                        </section>

                        <section className="rounded-xl bg-white p-5 shadow-sm">
                            <h3 className="text-lg font-semibold">Crear flujo del chatbot</h3>
                            <form onSubmit={submitFlow} className="mt-4 space-y-3">
                                <input className="w-full rounded border p-2" placeholder="Nombre del flujo" value={newFlow.name} onChange={(e) => setNewFlow({ ...newFlow, name: e.target.value })} />
                                <input className="w-full rounded border p-2" placeholder="Keywords separadas por coma" value={newFlow.keywords} onChange={(e) => setNewFlow({ ...newFlow, keywords: e.target.value })} />
                                <textarea className="w-full rounded border p-2" placeholder="Respuesta del bot" value={newFlow.reply} onChange={(e) => setNewFlow({ ...newFlow, reply: e.target.value })} />
                                <select className="w-full rounded border p-2" value={newFlow.type} onChange={(e) => setNewFlow({ ...newFlow, type: e.target.value })}>
                                    <option value="text">text</option>
                                    <option value="products">products</option>
                                </select>
                                <input type="number" className="w-full rounded border p-2" placeholder="Prioridad (menor = primero)" value={newFlow.priority} onChange={(e) => setNewFlow({ ...newFlow, priority: Number(e.target.value) })} />
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" checked={newFlow.is_active} onChange={(e) => setNewFlow({ ...newFlow, is_active: e.target.checked })} />
                                    Activo
                                </label>
                                <button className="rounded bg-slate-900 px-4 py-2 text-white">Guardar flujo</button>
                            </form>
                        </section>
                    </div>

                    <section className="rounded-xl bg-white p-5 shadow-sm">
                        <h3 className="text-lg font-semibold">Productos</h3>
                        <div className="mt-4 space-y-3">
                            {products.map((product) => (
                                <EditableProductRow key={product.id} initial={product} onSave={updateProduct} onDelete={deleteProduct} />
                            ))}
                        </div>
                    </section>

                    <section className="rounded-xl bg-white p-5 shadow-sm">
                        <h3 className="text-lg font-semibold">Flujos del chatbot</h3>
                        <div className="mt-4 space-y-3">
                            {flows.map((flow) => (
                                <EditableFlowRow key={flow.id} initial={flow} onSave={updateFlow} onDelete={deleteFlow} />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function EditableProductRow({ initial, onSave, onDelete }) {
    const [product, setProduct] = useState(initial);

    return (
        <div className="grid gap-2 rounded border p-3 md:grid-cols-6">
            <input className="rounded border p-2" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
            <input className="rounded border p-2" value={product.price} type="number" onChange={(e) => setProduct({ ...product, price: e.target.value })} />
            <input className="rounded border p-2" value={product.stock} type="number" onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })} />
            <input className="rounded border p-2" value={product.image ?? ''} placeholder="URL imagen" onChange={(e) => setProduct({ ...product, image: e.target.value })} />
            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={product.is_active} onChange={(e) => setProduct({ ...product, is_active: e.target.checked })} /> Activo
            </label>
            <div className="flex gap-2">
                <button type="button" className="rounded bg-emerald-600 px-3 py-2 text-white" onClick={() => onSave(product)}>Guardar</button>
                <button type="button" className="rounded bg-red-600 px-3 py-2 text-white" onClick={() => onDelete(product.id)}>Eliminar</button>
            </div>
            <textarea className="md:col-span-6 rounded border p-2" value={product.description ?? ''} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
        </div>
    );
}

function EditableFlowRow({ initial, onSave, onDelete }) {
    const [flow, setFlow] = useState({
        ...initial,
        keywords: Array.isArray(initial.keywords) ? initial.keywords.join(', ') : '',
    });

    return (
        <div className="grid gap-2 rounded border p-3 md:grid-cols-6">
            <input className="rounded border p-2" value={flow.name} onChange={(e) => setFlow({ ...flow, name: e.target.value })} />
            <input className="rounded border p-2" value={flow.priority} type="number" onChange={(e) => setFlow({ ...flow, priority: Number(e.target.value) })} />
            <select className="rounded border p-2" value={flow.type} onChange={(e) => setFlow({ ...flow, type: e.target.value })}>
                <option value="text">text</option>
                <option value="products">products</option>
            </select>
            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={flow.is_active} onChange={(e) => setFlow({ ...flow, is_active: e.target.checked })} /> Activo
            </label>
            <div className="md:col-span-2 flex gap-2">
                <button type="button" className="rounded bg-emerald-600 px-3 py-2 text-white" onClick={() => onSave(flow)}>Guardar</button>
                <button type="button" className="rounded bg-red-600 px-3 py-2 text-white" onClick={() => onDelete(flow.id)}>Eliminar</button>
            </div>
            <input className="md:col-span-6 rounded border p-2" value={flow.keywords} onChange={(e) => setFlow({ ...flow, keywords: e.target.value })} placeholder="keywords" />
            <textarea className="md:col-span-6 rounded border p-2" value={flow.reply} onChange={(e) => setFlow({ ...flow, reply: e.target.value })} />
        </div>
    );
}
