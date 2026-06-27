# RS Seguros Web

Frontend React + TypeScript + Vite da RS Seguros Proteção Veicular.

## Rodar localmente

```bash
npm install
npm run dev
```

Crie um `.env` local a partir de `.env.example` se precisar alterar a URL da API:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Build

```bash
npm run build
```

## Deploy na Vercel

Configure `VITE_API_BASE_URL` com a URL pública da API publicada na Render e use o build padrão do Vite.
