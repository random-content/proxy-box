FROM node:lts-alpine

RUN apk update && \
    addgroup -S proxybox && \
    adduser -S -G proxybox proxybox

WORKDIR /home/proxybox
USER proxybox

COPY . .
RUN npm install --production --verbose

CMD [ "node", "index.js" ]
