# Conexão Ativa

Plataforma para conectar pessoas através de atividades físicas, desenvolvida como um monorepo com API Node.js, aplicativo React Native e integração com Strava.

## 🏗️ Arquitetura

Este projeto utiliza uma arquitetura de monorepo com as seguintes partes:

- **API Backend** (`services/api`): Node.js + Express + Prisma + PostgreSQL
- **Aplicativo Mobile** (`apps/mobile`): Expo React Native
- **Tipos Compartilhados** (`packages/shared`): Validações Zod e tipos TypeScript

## 🚀 Funcionalidades

### API Backend
- ✅ Autenticação JWT com refresh tokens
- ✅ CRUD de usuários, locais e eventos
- ✅ Integração OAuth com Strava
- ✅ Rate limiting e segurança
- ✅ Logs estruturados
- ✅ Validação de dados com Zod

### Aplicativo Mobile
- ✅ Tela de login/cadastro
- ✅ Feed de eventos com participação
- ✅ Exploração de locais (lista e mapa)
- ✅ Criação de eventos
- ✅ Conexão com Strava
- ✅ Interface responsiva

## 🛠️ Tecnologias

### Backend
- Node.js 18+
- Express.js
- Prisma ORM
- PostgreSQL
- JWT para autenticação
- Winston para logs
- Helmet para segurança
- Express Rate Limit

### Mobile
- Expo SDK 49
- React Native
- React Navigation
- React Native Maps
- Axios para HTTP
- Expo Secure Store

### Compartilhado
- TypeScript
- Zod para validação

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- PostgreSQL (para produção)

### 1. Clonar e instalar dependências

\`\`\`bash
git clone <repository-url>
cd conexao-ativa
npm install
\`\`\`

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e configure as variáveis:

\`\`\`bash
cp services/api/.env.example services/api/.env
\`\`\`

Edite o arquivo `services/api/.env` com suas configurações:

\`\`\`env
DATABASE_URL="postgresql://username:password@localhost:5432/conexao_ativa"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
STRAVA_CLIENT_ID="your-strava-client-id"
STRAVA_CLIENT_SECRET="your-strava-client-secret"
STRAVA_REDIRECT_URI="http://localhost:3000/oauth/strava/callback"
\`\`\`

### 3. Configurar banco de dados

\`\`\`bash
# Gerar cliente Prisma
cd services/api
npx prisma generate

# Executar migrações
npx prisma migrate dev

# Popular com dados iniciais
npm run db:seed
\`\`\`

### 4. Executar em desenvolvimento

#### API Backend
\`\`\`bash
npm run dev:api
\`\`\`

#### Aplicativo Mobile
\`\`\`bash
npm run dev:mobile
\`\`\`

## 🧪 Testes

\`\`\`bash
npm test
\`\`\`

## 📱 Uso do Aplicativo

### Usuário Demo
- **Email**: demo@conexaoativa.app
- **Senha**: demo123

### Funcionalidades Principais

1. **Login/Cadastro**: Autenticação segura com JWT
2. **Feed de Eventos**: Visualize e participe de eventos
3. **Explorar Locais**: Veja locais em lista ou mapa
4. **Criar Eventos**: Organize suas próprias atividades
5. **Strava**: Conecte sua conta para sincronização

## 🚀 Deploy

### Railway (Recomendado)

1. Criar banco PostgreSQL no Railway
2. Criar novo serviço com o Dockerfile da API
3. Configurar variáveis de ambiente:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `PORT=8080`
   - `STRAVA_CLIENT_ID`
   - `STRAVA_CLIENT_SECRET`
   - `STRAVA_REDIRECT_URI`

4. Deploy automático via Git

### Dockerfile

O projeto inclui um Dockerfile otimizado para produção:

\`\`\`bash
docker build -t conexao-ativa-api .
docker run -p 8080:8080 conexao-ativa-api
\`\`\`

## 📊 Dados Iniciais

O projeto inclui seeds para a cidade de Araguaína-TO:

- **Parque Cimba** (Pista de corrida)
- **Quadra JK** (Quadra esportiva)
- **Campo Society Vila Norte** (Campo de futebol)
- **Ginásio IFTO** (Ginásio coberto)

## 🔧 Scripts Disponíveis

\`\`\`bash
# Desenvolvimento
npm run dev:api          # Executar API em desenvolvimento
npm run dev:mobile       # Executar app mobile

# Build
npm run build:api        # Build da API
npm run build:mobile     # Build do app mobile

# Banco de dados
npm run db:migrate       # Executar migrações
npm run db:seed          # Popular dados iniciais

# Testes e qualidade
npm test                 # Executar testes
npm run lint             # Verificar código
\`\`\`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte, entre em contato através do email: suporte@conexaoativa.app

---

Desenvolvido com ❤️ para conectar pessoas através do esporte e atividade física.

