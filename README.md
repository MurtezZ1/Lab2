# Sunspot - Electronic Online Shop Machine Learning

Sunspot is a Machine Learning project for analyzing and predicting product demand in an electronic online shop. The target variable is `DemandLevel`, with three classes: `Low`, `Medium`, and `High`.

## Project Overview

The project includes:

- Synthetic but realistic electronic product dataset generation
- Data cleaning and quality visualizations
- Exploratory Data Analysis
- Machine Learning preprocessing pipeline
- KNN, Decision Tree, Random Forest, Logistic Regression, SVM
- Neural Network Architecture 1 and Architecture 2
- Neural Network hyperparameter tuning
- K-Means clustering with elbow and silhouette analysis
- Cluster comparison with real `DemandLevel` labels
- Feature selection methods
- Final model comparison and university-style report

## Main Structure

```text
frontend/
  src/
  public/
  package.json
  vite.config.ts

backend/
  src/
  prisma/

data/
  sunspot_electronic_online_shop.csv

ml/
  sunspot_electronic_online_shop_pipeline.py

notebooks/
  sunspot_electronic_online_shop_analysis.ipynb

reports/
  sunspot_electronic_online_shop_final_report.md
  sunspot_electronic_online_shop_final_report.docx

outputs/
  sunspot_electronic_online_shop/

docs/
```

## Dataset

The main dataset is:

```text
data/sunspot_electronic_online_shop.csv
```

It contains product features such as category, brand, price, rating, reviews, stock quantity, discount, warranty, sold units, and demand level.

For model training, the integrated pipeline excludes:

- `ProductID`
- `ProductName`
- `SoldUnits`

`ProductID` and `ProductName` are identifiers/text fields. `SoldUnits` is excluded to avoid target leakage because it is strongly connected to `DemandLevel`.

## Installation

```bash
npm run install:all
pip install -r requirements.txt
```

Optional notebook/report tooling:

```bash
pip install -r requirements-notebooks.txt
```

## Database Setup

The backend uses PostgreSQL for relational data, MongoDB for notification/activity history, and Redis for cache.

Start MongoDB and Redis with Docker:

```bash
npm run infra:start
```

Copy `backend/.env.example` to `backend/.env`, then update `DATABASE_URL`, `MONGO_URL`, `REDIS_URL`, and Stripe keys if your local ports or payment credentials are different.

```bash
copy backend\.env.example backend\.env
npm run backend:setup
```

`npm run backend:setup` generates the Prisma client, runs PostgreSQL migrations, and seeds roles, permissions, admin user, categories, brands, and sample products.

## Stripe Payment Setup

Create a Stripe test account and add these values to `backend/.env`:

```env
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_CURRENCY=usd
```

For local webhook testing:

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

Use Stripe test card `4242 4242 4242 4242`, any future expiry date, any CVC, and any ZIP/postal code.

## Run The Main ML Pipeline

```bash
python ml/sunspot_electronic_online_shop_pipeline.py
```

The pipeline creates outputs in:

```text
outputs/sunspot_electronic_online_shop/
```

Including:

- Final model comparison table
- Confusion matrices
- Neural Network GridSearchCV results
- Best Neural Network configuration
- K-Means cluster metrics
- Elbow curve
- Silhouette score plot
- PCA cluster visualizations
- Cluster-label comparison heatmap

## Run The Web App

```bash
npm run infra:start
npm run backend:dev
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Technologies Used

- Python
- Pandas
- NumPy
- Scikit-learn
- Matplotlib
- Seaborn
- React
- Vite
- Express.js
- PostgreSQL
- Prisma ORM
- Socket.IO
- MongoDB
- Redis
- Stripe

## Main Results

The integrated pipeline trains and compares:

- KNN
- Decision Tree
- Random Forest
- Logistic Regression
- SVM
- Neural Network Architecture 1
- Neural Network Architecture 2

The final ranking is generated automatically in:

```text
outputs/sunspot_electronic_online_shop/model_comparison.csv
```

## Contributors

- Sunspot Electronic Online Shop ML team

## Future Improvements

- Add live prediction UI to the React + Vite application
- Store trained models through a model registry
- Add API endpoints for demand prediction
- Test additional models such as XGBoost or LightGBM
- Use real sales data when available
