FROM node:10.16

WORKDIR /blog

ADD . .

RUN yarn && \
    yarn build

EXPOSE 3000

CMD ["yarn", "serve"]
