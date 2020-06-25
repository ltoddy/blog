FROM node:12.17.0

WORKDIR /blog

ADD . .

RUN npm && \
    npm build

EXPOSE 3000

CMD ["npm", "serve"]
