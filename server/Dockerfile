FROM node:22-alpine AS build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .

EXPOSE 3000
CMD ["yarn", "start"]
