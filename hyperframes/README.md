# Chatbot WhatsApp Demo (HyperFrames)

Composicion principal: `compositions/chatbot-whatsapp-demo.html`  
Entrada del proyecto: `index.html`  
Formato: `1080x1920` (9:16)  
Duracion total: `39s`

## Preview

```powershell
cd hyperframes
& "C:\Program Files\nodejs\npx.cmd" hyperframes preview
```

## Render MP4

```powershell
cd hyperframes
& "C:\Program Files\nodejs\npx.cmd" hyperframes render --output output/chatbot-whatsapp-demo.mp4
```

## Validar estructura

```powershell
cd hyperframes
& "C:\Program Files\nodejs\npx.cmd" hyperframes lint
```

## Donde editar

- Textos: en el HTML de cada escena dentro de `compositions/chatbot-whatsapp-demo.html`.
- Colores: en variables CSS `:root` (`--emerald-*`, `--slate-*`).
- Duraciones de escenas: en el bloque JS `showScene(...)` y en `data-duration` del root (`39`).
- Timing de microanimaciones de chat: bloque `// Escena 3` del timeline GSAP.
- CTA final: nodo `#cta-btn` y bloque `// Escena 6`.

