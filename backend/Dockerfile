# Usa uma imagem oficial do Node.js como base
FROM node:18-alpine

# Instala o utilitário 'dos2unix' para corrigir quebras de linha
RUN apk add --no-cache dos2unix

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e package-lock.json primeiro
COPY package*.json ./

# Instala as dependências de produção
RUN npm ci --omit=dev

# Copia todo o resto do código do projeto
COPY . .

# CORREÇÃO: Garante que os scripts sejam executáveis no ambiente Alpine/Linux
RUN dos2unix ./node_modules/.bin/*

# Executa o script de build
RUN npm run build

# Expõe a porta 5000
EXPOSE 5000

# O comando que será executado quando o container iniciar
CMD [ "npm", "start" ]