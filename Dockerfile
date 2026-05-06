FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:20-alpine
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY --from=builder /app/dist ./dist
COPY database/migrations ./database/migrations
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh
EXPOSE 3001
CMD ["./entrypoint.sh"]
