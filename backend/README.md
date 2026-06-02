# Sunspot Backend Foundation

Safe-mode backend extension for the Electronic Online Shop. The React + Vite UI is not changed by this backend foundation.

## Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT access and refresh tokens
- bcrypt
- dotenv

## Install

```bash
cd backend
npm install
copy .env.example .env
```

Update `DATABASE_URL`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET` in `.env`.

## Database

Create a PostgreSQL database:

```sql
CREATE DATABASE sunspot_electronic_shop;
```

Run migration and seed:

```bash
npm run db:setup
```

## Run

```bash
npm run dev
```

Health check:

```text
GET http://localhost:5000/health
```

## Implemented Routes

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/verify-email
GET  /api/auth/me
GET  /api/rbac/admin-only
GET  /api/rbac/reports
```
