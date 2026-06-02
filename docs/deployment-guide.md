# Deployment Guide

## Frontend

```bash
npm install
npm run build
```

Deploy `dist/` to a static host.

## Backend

```bash
cd backend
npm install
copy .env.example .env
npm run prisma:deploy
npm run prisma:seed
npm run start
```

Required services:

- PostgreSQL
- Optional MongoDB for activity/history collections
- Optional Redis for caching

## Environment

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `MONGO_URL`
- `REDIS_URL`
- `CLIENT_URL`
