FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/build ./build
COPY start.sh .
RUN chmod +x start.sh

ENV NODE_ENV=production
EXPOSE 3000

CMD ["./start.sh"]
