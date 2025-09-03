FROM node:20 AS build
WORKDIR /app
COPY package.json ./
RUN yarn install --frozen-lockfile
COPY . .

EXPOSE 3000
CMD ["yarn", "start"]
