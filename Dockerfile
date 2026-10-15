# Imagen base ligera de Nginx para servir contenido estático
FROM nginx:alpine

# 1. Copiamos la configuración personalizada de Nginx para el proxy reverso (/api/)
COPY default.conf /etc/nginx/conf.d/default.conf

# 2. Copiamos ÚNICAMENTE los archivos del sitio web a la ruta pública de Nginx
COPY Clinica_HTML /usr/share/nginx/html

# 3. Exponemos el puerto 80 del contenedor
EXPOSE 80

# 4. Comando para mantener Nginx corriendo en primer plano dentro del contenedor
CMD ["nginx", "-g", "daemon off;"]