FROM node:16 as builder 

WORKDIR /app

COPY ./backend/package*.json .

RUN npm ci

COPY ./backend .

RUN npx prisma generate

RUN npm run build

FROM node:16

WORKDIR /app

# Frontend
COPY ./frontend /app/frontend

# Backend
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

CMD npx prisma migrate deploy && node dist/src/index.js
