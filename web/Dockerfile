FROM node:22.14-alpine AS builder

ENV API_URL=https://taskcy.online/api
ENV APP_URL=https://taskcy.online

WORKDIR /app
# Generate .env file using environment variables
RUN touch .env
RUN echo "VITE_API_URL=${API_URL}" > .env
RUN echo "VITE_APP_URL=${APP_URL}" >> .env
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# COPY nginx/default.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
