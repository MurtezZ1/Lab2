# Final Cleanup Backup Report

## Files And Folders Safe To Delete

| Path | Reason safe to remove |
|---|---|
| `.next/` | Old Next.js build cache. Active frontend is React + Vite in `frontend/`. |
| `next-local.out.log` | Old generated Next.js runtime log. Not referenced by code. |
| `next-local.err.log` | Old generated Next.js runtime error log. Not referenced by code. |
| `.local_mysql/` | Old local MySQL data directory. Active database uses PostgreSQL through `backend/prisma/schema.prisma`. |
| `frontend/public/prisma/` | Old MySQL Prisma schema/migrations moved with legacy public assets. Active Prisma schema is `backend/prisma/schema.prisma`. |
| `frontend/public/next.svg` | Default Next.js asset. No active imports or references. |
| `frontend/public/vercel.svg` | Default Vercel/Next.js asset. No active imports or references. |
| `frontend/public/window.svg` | Default template asset. No active imports or references. |
| `frontend/public/globe.svg` | Default template asset. No active imports or references. |
| `frontend/public/sunspot_products.json` | Legacy static product data. Active frontend uses backend product APIs. |
| `scripts/seed-database.mjs` | Obsolete seed wrapper. Root scripts call backend Prisma seed directly. |
| `vite-local.out.log` | Generated local Vite log. Not required by runtime. |
| `vite-local.err.log` | Generated local Vite error log. Not required by runtime. |
| `backend-local.out.log` | Generated local backend log. Not required by runtime. |
| `backend-local.err.log` | Generated local backend error log. Not required by runtime. |
| `tsconfig.tsbuildinfo` | Generated TypeScript incremental cache at repository root. |
| `frontend/tsconfig.tsbuildinfo` | Generated TypeScript incremental cache in frontend. |
| `dist/` | Old root build output from pre-frontend-folder structure. Active Vite output is `frontend/dist/`. |
| `frontend/dist/` | Generated build output. It is recreated by `npm run build`. |

## Files And Folders To Keep

| Path | Reason to keep |
|---|---|
| `frontend/src/` | Active React + Vite frontend source. |
| `frontend/public/file.svg` | Active fallback product image referenced by frontend and backend serialization/seed logic. |
| `frontend/package.json` | Active frontend dependencies and scripts. |
| `frontend/vite.config.ts` | Active Vite configuration. |
| `backend/` | Active Express, Prisma, PostgreSQL, MongoDB, Redis, Socket.IO, Stripe backend. |
| `backend/prisma/schema.prisma` | Active PostgreSQL Prisma schema. |
| `backend/prisma/migrations/` | Active PostgreSQL migrations. |
| `ml/` | Active machine learning scripts. |
| `data/` | Active dataset. |
| `notebooks/` | ML notebooks. |
| `reports/` | Final ML reports. |
| `outputs/` | ML generated evidence and figures. |
| `docs/` | Project documentation and audit reports. |
| `requirements.txt` | Core Python ML dependencies. |
| `requirements-notebooks.txt` | Optional notebook/report dependencies. |
| `docker-compose.yml` | MongoDB and Redis local services. |

## Reference Verification

No active code references were found for:

- Next.js imports: `next/link`, `next/navigation`, `next/image`
- Old MySQL Prisma provider: `provider = "mysql"`
- Legacy product JSON: `sunspot_products.json`
- Old Next/Vercel SVG assets

Active references were found for `/file.svg`, so `frontend/public/file.svg` must be kept.

