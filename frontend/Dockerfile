# Estágio 1: Build do React
FROM node:18-alpine as builder

RUN apk add --no-cache dos2unix

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

RUN dos2unix ./node_modules/.bin/*

RUN npm run build

# Estágio 2: Servir com Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]