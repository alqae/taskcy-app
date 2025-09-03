FROM node:22-alpine AS build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY .env.example .env
COPY . .

EXPOSE 3000
CMD ["yarn", "start"]
