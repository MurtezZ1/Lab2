# Electronic Online Shop - Exploratory Data Analysis

## Dataset Overview
- Rows: 2,400
- Columns: 12
- Duplicate rows: 0
- Missing values: 0
- Target column: `DemandLevel`
- Target classes: High, Low, Medium

## Statistical Summary
- Average price: $655.34
- Median price: $527.96
- Average rating: 4.00 / 5
- Average sold units: 487
- Total sold units: 1,168,655
- Average discount: 14.9%

## Main Findings
- The largest category is **Smartphone**, with 414 products.
- The most frequent brand is **Apple**, with 282 products.
- The most common demand level is **Medium**, with 1,348 products.
- The highest selling category by total units is **Smartphone**.
- Products with **High** demand have an average rating of 4.18, compared with 3.86 for **Low** demand products.
- The strongest numeric relationship with `SoldUnits` is **Rating** with correlation 0.21.

## Charts Generated
- `01_correlation_matrix.png`
- `02_category_distribution.png`
- `03_brand_distribution_top15.png`
- `04_price_distribution.png`
- `05_demand_level_distribution.png`
- `06_rating_analysis.png`
- `07_sales_by_category.png`
- `08_sales_by_demand_level.png`
- `09_price_vs_sold_units.png`
- `10_discount_vs_demand.png`

## Interpretation
The dataset is clean and ready for Machine Learning experiments. There are no missing values or duplicate records in the cleaned dataset. Demand level is suitable as a classification target, while price, rating, reviews, discounts, warranty, stock, and sold units provide useful numeric features for analysis and model training.