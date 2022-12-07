# Applications Security: Forum
<img src = "https://user-images.githubusercontent.com/60936394/206246215-8f8af289-dc75-4916-bf9d-912208f9cd77.png" width ="300" /> <img src = "https://user-images.githubusercontent.com/60936394/206246225-18cf8518-b81c-43ce-aeba-06e0214bc3a3.png" width ="300" />

## Overview
Simple forum project consisting of the following parts:

- **Frontend**: A SPA using just javascript, html and CSS (no frameworks!).
- **Backend**: A Express server using Prisma ORM (https://www.prisma.io/).
- **Proxy**: Caddy server (https://caddyserver.com/) that handles HTTPS certificates, serves the frontend and proxies API queries. 
- [**Postgresql**](https://www.postgresql.org/): forum database.


## Quickstart

To start the system execute the following commands:

```bash
docker-compose --profile backend build
docker-compose --profile backend up -d
```

The forum will be running at https://localhost or http://localhost. If you access to the HTTP version the reverse proxy will redirect you to the HTTPS site.

## API 
The API documentation can be found at [API.md](API.md)

## Development (backend)
For developing the backend:

1. Start only the frontend and the database:
```bash
docker compose up
```

2. Copy configuration files (backend folder):
```bash
cp .env.example .env
```

3. Install packages:

```
npm ci
```

4. Syncronize prisma schema:
```bash
npx prisma db push
```

5. Run nodemon
```
npx nodemon src/index.ts
```

Backend will be available at http://localhost:8080


## Deployment
The forum can be deployed to https://fly.io using it's free tier and it's postgrest solution https://fly.io/docs/postgres/

```bash
flyctl launch
```
