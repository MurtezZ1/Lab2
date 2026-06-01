# Sunspot - Electronic Online Shop Machine Learning

Sunspot is a Machine Learning project for analyzing and predicting product demand in an electronic online shop. The target variable is `DemandLevel`, with three classes: `Low`, `Medium`, and `High`.

## Project Overview

The project includes:

- Synthetic but realistic electronic product dataset generation
- Data cleaning and quality visualizations
- Exploratory Data Analysis
- Machine Learning preprocessing pipeline
- KNN, Decision Tree, Random Forest, Logistic Regression
- Neural Network Architecture 1 and Architecture 2
- Neural Network hyperparameter tuning
- K-Means clustering with elbow and silhouette analysis
- Cluster comparison with real `DemandLevel` labels
- Feature selection methods
- Final model comparison and university-style report

## Main Structure

```text
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
pip install -r requirements.txt
```

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
- TensorFlow
- Jupyter
- Plotly
- Next.js
- React

## Main Results

The integrated pipeline trains and compares:

- KNN
- Decision Tree
- Random Forest
- Logistic Regression
- Neural Network Architecture 1
- Neural Network Architecture 2

The final ranking is generated automatically in:

```text
outputs/sunspot_electronic_online_shop/model_comparison.csv
```

## Contributors

- Sunspot Electronic Online Shop ML team

## Future Improvements

- Add live prediction UI to the Next.js application
- Store trained models through a model registry
- Add API endpoints for demand prediction
- Test additional models such as XGBoost or LightGBM
- Use real sales data when available
