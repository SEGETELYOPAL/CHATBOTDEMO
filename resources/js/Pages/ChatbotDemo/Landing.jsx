import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WhatsAppChat from '@/Components/Chatbot/WhatsAppChat';

export default function Landing({ products }) {
    const { auth } = usePage().props;
    const rootRef = useRef(null);

    const benefits = [
        { icon: '🤖', text: 'Atencion automatica' },
        { icon: '🗂️', text: 'Catalogo conectado a base de datos' },
        { icon: '💬', text: 'Flujo tipo WhatsApp' },
        { icon: '📈', text: 'Ideal para tiendas, servicios y campanas' },
    ];

    const steps = [
        'El cliente abre el chat',
        'Escribe un mensaje',
        'El bot saluda automaticamente',
        'El bot muestra productos disponibles',
        'El cliente puede seguir la conversacion',
    ];

    const sponsorCards = [
        {
            title: 'API oficial de WhatsApp Business (Meta)',
            description: 'Canal oficial para mensajeria empresarial, plantillas y automatizacion de conversaciones.',
        },
        {
            title: 'BSP / Partner de integracion',
            description: 'Proveedor homologado para onboarding, calidad de numero, aprobacion de plantillas y operacion.',
        },
        {
            title: 'Implementacion del proyecto',
            description: 'Backend Laravel, panel admin, flujos del bot, catalogo y monitoreo de leads.',
        },
    ];

    const costRows = [
        { label: 'Template Marketing', usd: 0.03, unit: '/ mensaje' },
        { label: 'Template Utility', usd: 0.018, unit: '/ mensaje' },
        { label: 'Template Authentication', usd: 0.015, unit: '/ mensaje' },
        { label: 'Plataforma BSP', usdRange: [49, 149], unit: '/ mes' },
    ];

    const scenarios = [
        { name: 'Starter', marketing: 500, utility: 700, auth: 0, platform: 49 },
        { name: 'Growth', marketing: 2000, utility: 3000, auth: 300, platform: 99 },
        { name: 'Scale', marketing: 8000, utility: 12000, auth: 2000, platform: 149 },
    ];

    const calcTotal = (scenario) =>
        scenario.marketing * 0.03 +
        scenario.utility * 0.018 +
        scenario.auth * 0.015 +
        scenario.platform;

    const serviceTiers = {
        Starter: 450000,
        Growth: 900000,
        Scale: 1800000,
    };

    const usdToCop = 3560;
    const formatCop = (value) =>
        new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        }).format(value);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const sections = gsap.utils.toArray('[data-animate-section]');

            sections.forEach((section) => {
                gsap.set(section, { opacity: 0, y: 24 });
                gsap.to(section, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 82%',
                        end: 'bottom 18%',
                        toggleActions: 'play reverse play reverse',
                    },
                });
            });
        }, rootRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <Head title="Demo Chatbot" />

            <div ref={rootRef} className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100 text-gray-900">
                <header className="mx-auto flex w-full max-w-6xl items-center justify-end gap-3 px-6 py-4">
                    {auth?.user ? (
                        <Link href={route('dashboard')} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                            Ir al dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">
                                Login
                            </Link>
                            <Link href={route('register')} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                                Register
                            </Link>
                        </>
                    )}
                </header>

                <section data-animate-section className="mx-auto max-w-6xl px-6 py-10 lg:py-16">
                    <div className="grid items-center gap-10 lg:grid-cols-2">
                        <div>
                            <h1 className="text-5xl font-extrabold leading-tight lg:text-6xl">Chatbot comercial tipo WhatsApp</h1>
                            <p className="mt-4 text-xl text-gray-600 lg:text-2xl">Simula una conversacion automatica con tus clientes, muestra productos y responde mensajes basicos desde una interfaz moderna.</p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link href={route('chatbot.demo.chat')} className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700">
                                    Probar chatbot
                                </Link>
                                <a href="#productos" className="rounded-xl border border-emerald-600 px-5 py-3 font-semibold text-emerald-700 hover:bg-emerald-50">
                                    Ver productos
                                </a>
                            </div>
                        </div>
                        <WhatsAppChat initialProducts={products} />
                    </div>
                </section>

                <section data-animate-section className="mx-auto max-w-6xl px-6 py-12">
                    <h2 className="text-3xl font-bold">Beneficios</h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {benefits.map((benefit) => (
                            <div key={benefit.text} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-xl">
                                    <span aria-hidden="true">{benefit.icon}</span>
                                </div>
                                <p className="text-lg font-semibold">{benefit.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section data-animate-section className="mx-auto max-w-6xl px-6 py-12">
                    <h2 className="text-3xl font-bold">Como funciona</h2>
                    <ol className="mt-6 grid gap-3 md:grid-cols-2">
                        {steps.map((step, index) => (
                            <li key={step} className="rounded-xl border border-gray-200 bg-white p-4 text-lg shadow-sm">
                                <span className="font-bold text-emerald-700">{index + 1}.</span> {step}
                            </li>
                        ))}
                    </ol>
                </section>

                <section data-animate-section className="mx-auto max-w-6xl px-6 py-12">
                    <h2 className="text-3xl font-bold">Partners y arquitectura de integracion</h2>
                    <p className="mt-2 max-w-4xl text-lg text-gray-600">
                        Esta solucion se integra sobre la API de WhatsApp Business Platform de Meta, con un BSP como capa operativa
                        y un panel administrativo propio para controlar productos, respuestas y automatizaciones.
                    </p>
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {sponsorCards.map((item) => (
                            <article key={item.title} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="mt-2 text-base text-gray-600">{item.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section data-animate-section className="mx-auto max-w-6xl px-6 py-12">
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                        <h2 className="text-3xl font-bold">Proyeccion de inversion mensual (estimada)</h2>
                        <p className="mt-2 text-lg text-amber-800">
                            Referencia comercial para planeacion inicial. El costo final depende del pais destino del mensaje,
                            categoria de template aprobada por Meta y plan contratado con tu BSP.
                        </p>
                        <p className="mt-1 text-sm text-amber-700">
                            Tasa de referencia usada: 1 USD = {usdToCop.toLocaleString('es-CO')} COP (actualiza esta tasa en propuesta final).
                        </p>

                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                            {costRows.map((row) => (
                                <div key={row.label} className="rounded-lg border border-amber-200 bg-white p-3">
                                    <p className="text-lg font-semibold">{row.label}</p>
                                    <p className="text-base text-gray-700">
                                        {row.usd
                                            ? `${formatCop(row.usd * usdToCop)} ${row.unit}`
                                            : `${formatCop(row.usdRange[0] * usdToCop)} - ${formatCop(row.usdRange[1] * usdToCop)} ${row.unit}`}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                            <div className="rounded-lg border border-amber-200 bg-white p-3 text-sm text-gray-700">
                                <p className="font-semibold text-gray-900">Incluye en esta proyeccion</p>
                                <p className="mt-1">Mensajeria de la API de WhatsApp Business + fee mensual de plataforma BSP.</p>
                            </div>
                            <div className="rounded-lg border border-amber-200 bg-white p-3 text-sm text-gray-700">
                                <p className="font-semibold text-gray-900">No incluye</p>
                                <p className="mt-1">Desarrollo adicional, agentes humanos, CRM externo o pauta publicitaria.</p>
                            </div>
                        </div>

                        <div className="mt-6 overflow-x-auto">
                            <table className="min-w-full rounded-lg bg-white text-sm">
                                <thead>
                                    <tr className="bg-slate-100 text-left">
                                        <th className="px-3 py-2">Escenario de uso</th>
                                        <th className="px-3 py-2">Volumen mensual de templates</th>
                                        <th className="px-3 py-2">Rango estimado COP/mes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scenarios.map((scenario) => (
                                        <tr key={scenario.name} className="border-t">
                                            <td className="px-3 py-2 font-semibold">{scenario.name}</td>
                                            <td className="px-3 py-2">
                                                MKT {scenario.marketing} | UTL {scenario.utility} | AUTH {scenario.auth}
                                            </td>
                                            <td className="px-3 py-2 font-semibold">
                                                {formatCop(calcTotal(scenario) * usdToCop)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8 overflow-x-auto">
                            <h3 className="mb-3 text-2xl font-bold text-gray-900">Estimado global tercerizado (API + servicio)</h3>
                            <table className="min-w-full rounded-lg bg-white text-base">
                                <thead>
                                    <tr className="bg-slate-100 text-left">
                                        <th className="px-3 py-2">Plan comercial</th>
                                        <th className="px-3 py-2">Costo API WhatsApp (COP)</th>
                                        <th className="px-3 py-2">Membresia servicio (COP)</th>
                                        <th className="px-3 py-2">Total cliente sugerido (COP/mes)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scenarios.map((scenario) => {
                                        const apiCost = Math.round(calcTotal(scenario) * usdToCop);
                                        const membership = serviceTiers[scenario.name] ?? 0;
                                        const totalClient = apiCost + membership;

                                        return (
                                            <tr key={`${scenario.name}-outsourcing`} className="border-t">
                                                <td className="px-3 py-2 font-semibold">{scenario.name}</td>
                                                <td className="px-3 py-2">{formatCop(apiCost)}</td>
                                                <td className="px-3 py-2">{formatCop(membership)}</td>
                                                <td className="px-3 py-2 font-bold text-emerald-700">{formatCop(totalClient)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <p className="mt-4 text-sm text-amber-800">
                            La membresia incluye administracion de plataforma, ajustes de flujos, soporte operativo y seguimiento basico.
                            Puedes ajustar estos valores segun SLA, cobertura horaria y volumen real del cliente.
                        </p>
                    </div>
                </section>

                <section data-animate-section id="productos" className="mx-auto max-w-6xl px-6 py-12">
                    <h2 className="text-3xl font-bold">Productos cargados</h2>
                    <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {products.map((product) => (
                            <article key={product.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                <h3 className="text-lg font-semibold">{product.name}</h3>
                                <p className="mt-1 text-base text-gray-600">{product.description}</p>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
