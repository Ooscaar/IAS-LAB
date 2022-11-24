FROM node:16-alpine

WORKDIR /app

COPY ./backend/package.json .
COPY ./backend/package-lock.json .

RUN npm ci

COPY ./backend .

RUN npx prisma generate

RUN npm run build

# Frontend
COPY ./frontend /app/frontend


CMD npx prisma migrate deploy && node dist/src/index.js
