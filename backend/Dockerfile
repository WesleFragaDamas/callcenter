# Usa uma imagem oficial do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e package-lock.json primeiro
COPY package*.json ./

# Instala as dependências de produção. 'npm ci' é mais rápido e confiável para builds.
RUN npm ci --omit=dev

# Copia todo o resto do código do projeto
COPY . .

# Executa o script de build
RUN npm run build

# Expõe a porta 5000
EXPOSE 5000

# O comando que será executado quando o container iniciar
CMD [ "npm", "start" ]