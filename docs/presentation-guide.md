# Presentation Guide

This guide supports a 5-10 minute presentation for the combined Lab Course 2 and Machine Learning Models project.

## 1. Project Overview

- Project name: Electronic Online Shop / Sunspot
- Goal: a full-stack e-commerce platform with ML/AI features for product demand prediction, recommendations, analytics, and administration.
- Main users: customers, admins, managers.

## 2. Architecture

Explain the structure:

- `frontend/`: React + Vite, Redux Toolkit, route-based lazy loading
- `backend/`: Node.js + Express, controllers/services/repositories
- `backend/prisma/`: PostgreSQL schema and migrations
- `ml/`: Python ML scripts
- `docs/`: reports and deployment documentation
- `infra/`: Terraform AWS infrastructure

## 3. Database

Show:

- Prisma schema with 33 models
- RBAC tables: users, roles, permissions
- Commerce tables: products, cart, orders, payments, invoices
- Support and audit tables: support tickets, audit logs, notifications

Professor question: Why PostgreSQL?

Answer: PostgreSQL is relational, reliable, and works well with Prisma for normalized schemas, relations, constraints, and transactions.

## 4. Backend

Show:

- Authentication with JWT and refresh tokens
- RBAC and permission middleware
- Product, cart, order, payment, invoice, analytics, AI, and notification APIs
- Swagger at `/api-docs`

Professor question: Where is business logic?

Answer: Business logic is in `backend/src/services`; controllers call services; repositories handle database access.

## 5. Frontend

Show:

- Home page with product carousels
- Product listing and details
- Cart and checkout
- Compare page
- User dashboard
- Admin dashboard
- Dark mode and Google Maps footer

Professor question: How is performance improved?

Answer: Routes and admin panels use `React.lazy` and `Suspense`; images use lazy loading; state is centralized with Redux Toolkit.

## 6. Machine Learning

Show:

- Dataset: `data/sunspot_electronic_online_shop.csv`
- Target: `DemandLevel`
- Models: KNN, Decision Tree, Random Forest, Logistic Regression, SVM, Neural Networks
- Clustering: KMeans with PCA, elbow method, silhouette score
- Final comparison table in `outputs/sunspot_electronic_online_shop/model_comparison.csv`

Professor question: Which model performed best?

Answer: Neural Network Architecture 2 ranked first by weighted F1 score in the final comparison.

## 7. AI Features

Show:

- AI Shopping Assistant floating button
- Product recommendations
- Similar products widget
- AI Demand Forecast in the admin analytics dashboard

Professor question: What happens without OpenAI API key?

Answer: The assistant falls back to local recommendation logic, so the feature still works.

## 8. Reports And Invoices

Show:

- Dynamic reports with PDF/Excel/CSV export
- PDF invoice generation and download
- Admin invoice search and download

## 9. Infrastructure

Show:

- Terraform modules in `infra/terraform`
- S3, ECR, ECS Fargate, VPC, CloudWatch, Secrets Manager, SageMaker role
- GitHub Actions workflow with safe AWS secret handling

## 10. Conclusion

Summarize:

- The app satisfies full-stack requirements.
- The ML workflow satisfies classification, tuning, feature selection, clustering, and reporting requirements.
- The project is ready for presentation and Moodle submission after final local validation.

## Demo Flow

1. Open home page.
2. Search/filter products.
3. Open a product and show 360 viewer/specifications.
4. Add product to cart/wishlist/compare.
5. Show checkout and Stripe integration.
6. Login as admin.
7. Show admin users/roles.
8. Show analytics dashboard and AI Demand Forecast.
9. Show AI Shopping Assistant.
10. Show ML report and model comparison table.
