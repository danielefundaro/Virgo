FROM node:current-alpine3.17 AS build

WORKDIR /dist/src/app
RUN npm cache clean --force
COPY . .
RUN npm install
RUN npm run build --omit=dev

FROM nginx:1.24.0-alpine-slim AS ngi
COPY --from=build /dist/src/app/dist/frontend /usr/share/nginx/html
COPY ./frontend/default.conf  /etc/nginx/conf.d/default.conf

ENTRYPOINT ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]

EXPOSE 80
