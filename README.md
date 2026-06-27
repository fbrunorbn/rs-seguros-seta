# RS Seguros Proteção Veicular

Projeto full stack para landing page de captação de leads e painel administrativo simples.

## Estrutura

```text
RsSeguros/
  backend/
    RsSeguros.Api/
  frontend/
    rs-seguros-web/
  README.md
  .gitignore
```

## Backend

```bash
cd backend/RsSeguros.Api
dotnet restore
dotnet run
```

Crie `backend/RsSeguros.Api/.env` a partir de `.env.example` e preencha as variáveis no ambiente local. Não versionar `.env`.

Para gerar o hash da senha admin:

```bash
dotnet run -- generate-hash "minhaSenha"
```

Teste:

```bash
curl http://localhost:8080/api/health
```

## Frontend

```bash
cd frontend/rs-seguros-web
npm install
npm run dev
```

Crie `frontend/rs-seguros-web/.env` a partir de `.env.example` quando precisar alterar a URL da API.

## Variáveis principais

Backend:

- `MONGODB_CONNECTION_STRING`
- `MONGODB_DATABASE_NAME`
- `MONGODB_LEADS_COLLECTION`
- `JWT_SECRET`
- `JWT_ISSUER`
- `JWT_AUDIENCE`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`
- `ALLOWED_ORIGINS`

Frontend:

- `VITE_API_BASE_URL`

## Deploy

Render: publique `backend/RsSeguros.Api` via Dockerfile e configure as variáveis de ambiente no painel.

Vercel: publique `frontend/rs-seguros-web`, configure `VITE_API_BASE_URL` com a URL pública da API e use o build padrão do Vite.
