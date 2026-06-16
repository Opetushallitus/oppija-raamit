FROM nginx
COPY nginx.local-oppija-raamit.conf /etc/nginx/nginx.conf
COPY src/main/resources/public /usr/share/nginx/html