# Project Management

Project: Electronic Online Shop / Sunspot  
Courses: Lab Course 2 and Machine Learning Models  
Method: Lightweight Kanban board for a two-person student team.

## Team Responsibilities

| Member | Main Responsibilities |
|---|---|
| Person A | Backend architecture, PostgreSQL/Prisma schema, authentication, RBAC, APIs, Socket.IO, reports, infrastructure |
| Person B | Frontend pages, Redux state, product UI, checkout flow, dashboards, documentation, ML notebooks/scripts |

## Project Board

### Backlog

| Task | Owner | Priority | Notes |
|---|---|---:|---|
| Add AWS production HTTPS certificate | Person A | Low | Use ACM and HTTPS listener before real production |
| Add automated end-to-end tests | Person B | Low | Playwright or Cypress could be added later |
| Add real production payment account | Person A | Low | Stripe test mode is documented and integrated |

### To Do

| Task | Owner | Priority | Due |
|---|---|---:|---|
| Final professor demo rehearsal | Person A + Person B | Medium | Presentation day |
| Add optional production monitoring alarms | Person A | Low | After AWS account setup |

### In Progress

| Task | Owner | Priority | Status |
|---|---|---:|---|
| Final repository validation | Person A + Person B | High | Build, backend, DB, ML, and docs checked |

### Review

| Task | Owner | Reviewer | Status |
|---|---|---|---|
| Machine Learning final report | Person B | Person A | Completed, ready for submission |
| Infrastructure documentation | Person A | Person B | Completed, ready for submission |

### Done

| Task | Owner | Evidence |
|---|---|---|
| React + Vite frontend migration | Person B | `frontend/`, `frontend/src/routes/AppRoutes.tsx` |
| Backend layered architecture | Person A | `backend/src/controllers`, `services`, `repositories`, `routes` |
| PostgreSQL Prisma schema | Person A | `backend/prisma/schema.prisma` |
| Authentication and RBAC | Person A | `authService.js`, `authRoutes.js`, admin routes |
| Admin and user dashboards | Person B | `AdminDashboardPage.tsx`, `UserDashboardPage.tsx` |
| Analytics dashboard | Person A + Person B | `AdminAnalyticsDashboardPage.tsx`, `analyticsService.js` |
| AI demand forecast | Person A + Person B | `analyticsService.js`, `AdminAnalyticsDashboardPage.tsx` |
| Product 360 viewer | Person B | `Product360Viewer.tsx`, `ProductDetailsPage.tsx` |
| Product comparison | Person B | `ComparePage.tsx`, `compareSlice.ts` |
| PDF invoices | Person A | `invoiceService.js`, `invoiceRoutes.js` |
| Stripe payment integration | Person A + Person B | `paymentService.js`, `StripePaymentForm.tsx` |
| Socket.IO notifications | Person A + Person B | `socket.js`, `socketService.ts` |
| ML classification and clustering | Person B | `ml/`, `outputs/`, `reports/` |
| AWS Terraform infrastructure | Person A | `infra/terraform`, `.github/workflows/deploy.yml` |

## Timeline

| Phase | Dates | Deliverables |
|---|---|---|
| Phase 1 | Week 1 | Dataset, cleaning, EDA, baseline frontend/backend |
| Phase 2 | Week 2 | Authentication, product catalog, cart, orders, dashboards |
| Phase 3 | Week 3 | ML models, feature selection, clustering, reports |
| Phase 4 | Week 4 | Advanced features: AI assistant, analytics, invoices, comparison |
| Phase 5 | Final week | AWS IaC, final audit, documentation, presentation guide |

## Definition Of Done

- Code builds without TypeScript or syntax errors.
- Backend starts and API endpoints respond.
- Prisma schema validates and migrations are applied.
- Documentation exists for setup, API, ERD, ML, infrastructure, and presentation.
- Main workflows are demonstrable locally.
