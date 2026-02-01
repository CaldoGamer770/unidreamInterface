# Paso 1: Construir la app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Paso 2: Servir la app con Nginx (mucho más estable)
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copiamos una configuración simple para que las rutas de React/Vite funcionen
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]