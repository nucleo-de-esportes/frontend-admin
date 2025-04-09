# Etapa 1: build da aplicação com Node.js
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: servir com NGINX
FROM nginx:stable-alpine AS production

# Copia o build gerado para a pasta pública do NGINX
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove a configuração default do NGINX
RUN rm /etc/nginx/conf.d/default.conf

# Adiciona uma configuração customizada
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
