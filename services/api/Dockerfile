FROM node:18-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY services/api/package*.json ./services/api/

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY packages/shared ./packages/shared
COPY services/api ./services/api

# Build do shared package
WORKDIR /app/packages/shared
RUN npm run build

# Build da API
WORKDIR /app/services/api
RUN npx prisma generate
RUN npm run build

# Criar diretório de logs
RUN mkdir -p logs

# Expor porta
EXPOSE 8080

# Comando para iniciar
CMD ["npm", "start"]

