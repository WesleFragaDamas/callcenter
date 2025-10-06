# Usa uma imagem oficial do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e package-lock.json para o container
COPY package*.json ./

# Instala as dependências de produção
RUN npm install --omit=dev

# Copia todo o resto do código do projeto para o container
COPY . .

# Executa o script de build para criar a pasta 'dist'
RUN npm run build

# Expõe a porta 5000 para o mundo exterior
EXPOSE 5000

# O comando que será executado quando o container iniciar
CMD [ "npm", "start" ]