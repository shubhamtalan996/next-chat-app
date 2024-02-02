FROM node:16.14.0

# declare ENV here

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 3000

CMD yarn run dev