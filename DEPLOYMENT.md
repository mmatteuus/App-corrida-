# Guia de Deploy - Conexão Ativa

## 🚀 Deploy no Railway

### Pré-requisitos
- Conta no Railway (https://railway.app)
- Repositório GitHub com o código

### 1. Configurar Banco de Dados PostgreSQL

1. Acesse o Railway Dashboard
2. Clique em "New Project"
3. Selecione "Provision PostgreSQL"
4. Anote a `DATABASE_URL` gerada

### 2. Deploy da API

1. No Railway, clique em "New Service"
2. Conecte seu repositório GitHub
3. Selecione o repositório `App-corrida-`
4. Configure as variáveis de ambiente:

```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=conexao-ativa-super-secret-jwt-key-2024
JWT_REFRESH_SECRET=conexao-ativa-super-secret-refresh-key-2024
PORT=8080
NODE_ENV=production
STRAVA_CLIENT_ID=your-strava-client-id
STRAVA_CLIENT_SECRET=your-strava-client-secret
STRAVA_REDIRECT_URI=https://your-api-url.railway.app/oauth/strava/callback
CORS_ORIGIN=*
```

5. Configure o build:
   - Build Command: `npm run build:api`
   - Start Command: `npm run start --workspace=services/api`

### 3. Executar Migrações

Após o deploy, execute as migrações:

```bash
# No terminal do Railway ou localmente
npx prisma migrate deploy --schema=services/api/prisma/schema.prisma
npx prisma db seed --schema=services/api/prisma/schema.prisma
```

## 🐳 Deploy com Docker

### Build da Imagem

```bash
cd services/api
docker build -t conexao-ativa-api .
```

### Executar Container

```bash
docker run -p 8080:8080 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="your-secret" \
  -e JWT_REFRESH_SECRET="your-refresh-secret" \
  -e STRAVA_CLIENT_ID="your-client-id" \
  -e STRAVA_CLIENT_SECRET="your-client-secret" \
  -e STRAVA_REDIRECT_URI="https://your-domain.com/oauth/strava/callback" \
  conexao-ativa-api
```

## 📱 Deploy do App Mobile

### Expo Build

```bash
cd apps/mobile
expo build:android
expo build:ios
```

### Configurar API URL

Antes do build, atualize a URL da API em `apps/mobile/src/services/api.ts`:

```typescript
const API_URL = 'https://your-api-url.railway.app';
```

## 🔧 Configuração do Strava OAuth

1. Acesse https://www.strava.com/settings/api
2. Crie uma nova aplicação
3. Configure:
   - **Authorization Callback Domain**: `your-api-url.railway.app`
   - **Website**: `https://your-api-url.railway.app`
4. Anote o `Client ID` e `Client Secret`
5. Configure as variáveis de ambiente no Railway

## ✅ Verificação do Deploy

### Endpoints para Testar

```bash
# Health check
curl https://your-api-url.railway.app/health

# Listar locais
curl https://your-api-url.railway.app/places

# Listar eventos
curl https://your-api-url.railway.app/events

# Login com usuário demo
curl -X POST https://your-api-url.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@conexaoativa.app","password":"demo123"}'
```

## 🔒 Configurações de Segurança

### Variáveis de Ambiente Obrigatórias

- `JWT_SECRET`: Chave secreta para tokens JWT (mínimo 32 caracteres)
- `JWT_REFRESH_SECRET`: Chave secreta para refresh tokens
- `DATABASE_URL`: URL de conexão com PostgreSQL
- `STRAVA_CLIENT_ID`: ID da aplicação Strava
- `STRAVA_CLIENT_SECRET`: Secret da aplicação Strava

### HTTPS

- Railway fornece HTTPS automaticamente
- Certifique-se de que `STRAVA_REDIRECT_URI` use HTTPS

## 📊 Monitoramento

### Logs

```bash
# Railway CLI
railway logs

# Docker
docker logs container-name
```

### Métricas

- Railway Dashboard fornece métricas básicas
- Para monitoramento avançado, integre com Sentry ou New Relic

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro de Conexão com Banco**
   - Verifique se `DATABASE_URL` está correta
   - Confirme se as migrações foram executadas

2. **Erro de JWT**
   - Verifique se `JWT_SECRET` está definido
   - Confirme se tem pelo menos 32 caracteres

3. **Erro do Strava OAuth**
   - Verifique se `STRAVA_REDIRECT_URI` está correto
   - Confirme se o domínio está autorizado no Strava

### Comandos Úteis

```bash
# Verificar variáveis de ambiente
railway variables

# Executar comando no container
railway run bash

# Ver logs em tempo real
railway logs --follow
```

## 📈 Otimizações para Produção

1. **Banco de Dados**
   - Use connection pooling
   - Configure índices apropriados
   - Monitore performance das queries

2. **API**
   - Configure rate limiting adequado
   - Use Redis para cache (opcional)
   - Monitore uso de memória

3. **Segurança**
   - Configure CORS adequadamente
   - Use HTTPS em todas as comunicações
   - Monitore tentativas de acesso não autorizado

