FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG REACT_APP_API_URL=http://localhost:3000
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/build ./build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
