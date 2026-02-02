# Etapa 1: Construcción (Cambiamos a Node 22 para que Vite no se queje)
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor de producción (Nginx para que sea eterno y rápido)
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Configuración para que las rutas de React/Vite no den error 404 al recargar
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]