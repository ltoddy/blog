FROM node:12.17.0

WORKDIR /blog

ADD . .

RUN npm install && \
    npm run build

EXPOSE 3000

CMD ["npm", "serve"]
