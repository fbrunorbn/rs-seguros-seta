# RS Seguros API

API ASP.NET Core 9 para captação e administração de leads da RS Seguros Proteção Veicular.

## Rodar localmente

```bash
dotnet restore
dotnet run
```

Crie um arquivo `.env` local baseado em `.env.example` e preencha:

- `MONGODB_CONNECTION_STRING`
- `MONGODB_DATABASE_NAME`
- `MONGODB_LEADS_COLLECTION`
- `JWT_SECRET`
- `JWT_ISSUER`
- `JWT_AUDIENCE`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`
- `ALLOWED_ORIGINS`

O arquivo `.env` não deve ser versionado.

## Gerar hash da senha admin

```bash
dotnet run -- generate-hash "minhaSenha"
```

Copie apenas o hash impresso para `ADMIN_PASSWORD_HASH`. Não salve a senha em texto puro.

## Testar saúde

```bash
curl http://localhost:8080/api/health
```

Resposta esperada:

```json
{ "status": "ok", "service": "RS Seguros API" }
```

## Criar lead

```bash
curl -X POST http://localhost:8080/api/leads \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Cliente Teste\",\"whatsapp\":\"88992612577\",\"cidade\":\"Limoeiro do Norte\",\"tipoVeiculo\":\"Carro\",\"consentimentoLgpd\":true}"
```

## Render

1. Crie um novo Web Service apontando para `backend/RsSeguros.Api`.
2. Use Docker como runtime.
3. Configure as variáveis do `.env.example` no painel da Render.
4. Use porta `8080`.
5. Adicione a URL da Vercel em `ALLOWED_ORIGINS`.

Swagger fica disponível apenas em ambiente de desenvolvimento.
