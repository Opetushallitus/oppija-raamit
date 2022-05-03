FROM nginx
COPY nginx.local-oppija-raamit.conf /etc/nginx/nginx.conf
COPY target/classes/public /usr/share/nginx/html
