import os

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns


RANDOM_SEED = 42
ROW_COUNT = 2400
OUTPUT_DIR = "electronic_online_shop_output"


PRODUCT_CATALOG = {
    "Laptop": {
        "names": ["Ultrabook", "Gaming Laptop", "Business Notebook", "2-in-1 Laptop", "Creator Laptop"],
        "brands": ["Dell", "HP", "Lenovo", "Asus", "Acer", "Apple", "MSI"],
        "price_range": (450, 3200),
        "warranty": [12, 24, 36],
    },
    "Smartphone": {
        "names": ["Smartphone", "Pro Smartphone", "Foldable Phone", "Budget Phone", "5G Phone"],
        "brands": ["Samsung", "Apple", "Xiaomi", "OnePlus", "Google", "Motorola"],
        "price_range": (180, 1600),
        "warranty": [12, 24],
    },
    "Tablet": {
        "names": ["Tablet", "Drawing Tablet", "Kids Tablet", "Pro Tablet", "Mini Tablet"],
        "brands": ["Apple", "Samsung", "Lenovo", "Huawei", "Microsoft"],
        "price_range": (120, 1300),
        "warranty": [12, 24],
    },
    "Headphones": {
        "names": ["Wireless Headphones", "Noise Cancelling Headphones", "Gaming Headset", "Earbuds", "Studio Headphones"],
        "brands": ["Sony", "Bose", "JBL", "Sennheiser", "Logitech", "Apple"],
        "price_range": (25, 450),
        "warranty": [6, 12, 24],
    },
    "Smartwatch": {
        "names": ["Smartwatch", "Fitness Watch", "GPS Watch", "Hybrid Watch", "Sports Watch"],
        "brands": ["Apple", "Samsung", "Garmin", "Fitbit", "Huawei", "Amazfit"],
        "price_range": (45, 900),
        "warranty": [12, 24],
    },
    "Camera": {
        "names": ["Mirrorless Camera", "DSLR Camera", "Action Camera", "Vlogging Camera", "Instant Camera"],
        "brands": ["Canon", "Nikon", "Sony", "GoPro", "Fujifilm", "Panasonic"],
        "price_range": (150, 2800),
        "warranty": [12, 24, 36],
    },
    "TV": {
        "names": ["4K TV", "OLED TV", "QLED TV", "Smart TV", "Mini LED TV"],
        "brands": ["Samsung", "LG", "Sony", "TCL", "Hisense", "Philips"],
        "price_range": (250, 3500),
        "warranty": [12, 24, 36],
    },
    "Gaming Console": {
        "names": ["Gaming Console", "Handheld Console", "VR Bundle", "Console Bundle", "Retro Console"],
        "brands": ["Sony", "Microsoft", "Nintendo", "Meta", "Valve"],
        "price_range": (180, 950),
        "warranty": [12, 24],
    },
    "Monitor": {
        "names": ["Gaming Monitor", "4K Monitor", "Curved Monitor", "Office Monitor", "Ultrawide Monitor"],
        "brands": ["Dell", "LG", "Samsung", "Asus", "AOC", "BenQ"],
        "price_range": (90, 1500),
        "warranty": [12, 24, 36],
    },
    "Accessory": {
        "names": ["Wireless Mouse", "Mechanical Keyboard", "USB-C Hub", "Power Bank", "Webcam"],
        "brands": ["Logitech", "Anker", "Razer", "Belkin", "Corsair", "Microsoft"],
        "price_range": (10, 250),
        "warranty": [6, 12, 24],
    },
}


def generate_product_name(category, brand, rng):
    model_code = f"{rng.choice(list('ABCDEFGHIJKLMNOPQRSTUVWXYZ'))}{rng.integers(100, 999)}"
    descriptor = rng.choice(PRODUCT_CATALOG[category]["names"])
    return f"{brand} {descriptor} {model_code}"


def create_dataset(row_count=ROW_COUNT, seed=RANDOM_SEED):
    rng = np.random.default_rng(seed)
    categories = list(PRODUCT_CATALOG.keys())
    category_probabilities = np.array([0.13, 0.16, 0.09, 0.12, 0.09, 0.07, 0.1, 0.06, 0.09, 0.09])

    rows = []
    for i in range(1, row_count + 1):
        category = rng.choice(categories, p=category_probabilities)
        details = PRODUCT_CATALOG[category]
        brand = rng.choice(details["brands"])
        min_price, max_price = details["price_range"]

        price = round(float(rng.lognormal(mean=np.log((min_price + max_price) / 3), sigma=0.45)), 2)
        price = round(float(np.clip(price, min_price, max_price)), 2)
        rating = round(float(np.clip(rng.normal(4.0, 0.55), 1.0, 5.0)), 1)
        number_of_reviews = int(np.clip(rng.gamma(shape=2.2, scale=80), 0, 5000))
        stock_quantity = int(np.clip(rng.normal(130, 70), 0, 600))
        discount_percentage = int(np.clip(rng.normal(15, 12), 0, 70))
        warranty_months = int(rng.choice(details["warranty"], p=np.ones(len(details["warranty"])) / len(details["warranty"])))

        affordability_score = 1 - ((price - min_price) / (max_price - min_price))
        quality_score = rating / 5
        promotion_score = discount_percentage / 70
        review_score = np.log1p(number_of_reviews) / np.log1p(5000)
        base_demand = (
            0.30 * affordability_score
            + 0.28 * quality_score
            + 0.20 * review_score
            + 0.14 * promotion_score
            + rng.normal(0, 0.08)
        )
        sold_units = int(np.clip(base_demand * rng.normal(850, 140), 0, 2000))

        if sold_units >= 600:
            demand_level = "High"
        elif sold_units >= 400:
            demand_level = "Medium"
        else:
            demand_level = "Low"

        rows.append(
            {
                "ProductID": f"EOS-{i:05d}",
                "ProductName": generate_product_name(category, brand, rng),
                "Category": category,
                "Brand": brand,
                "Price": price,
                "Rating": rating,
                "NumberOfReviews": number_of_reviews,
                "StockQuantity": stock_quantity,
                "DiscountPercentage": discount_percentage,
                "WarrantyMonths": warranty_months,
                "SoldUnits": sold_units,
                "DemandLevel": demand_level,
            }
        )

    return pd.DataFrame(rows)


def inject_quality_issues(df, seed=RANDOM_SEED):
    rng = np.random.default_rng(seed + 1)
    dirty_df = df.copy()

    missing_columns = ["Price", "Rating", "NumberOfReviews", "StockQuantity", "DiscountPercentage", "WarrantyMonths", "Brand"]
    for column in missing_columns:
        missing_count = max(1, int(len(dirty_df) * rng.uniform(0.01, 0.035)))
        dirty_df.loc[rng.choice(dirty_df.index, size=missing_count, replace=False), column] = np.nan

    duplicate_rows = dirty_df.sample(n=35, random_state=seed)
    dirty_df = pd.concat([dirty_df, duplicate_rows], ignore_index=True)

    outlier_indices = rng.choice(dirty_df.index, size=30, replace=False)
    dirty_df.loc[outlier_indices[:10], "Price"] *= rng.uniform(4.0, 7.0, size=10)
    dirty_df.loc[outlier_indices[10:20], "NumberOfReviews"] *= rng.integers(8, 15, size=10)
    dirty_df.loc[outlier_indices[20:], "SoldUnits"] *= rng.integers(4, 9, size=10)

    return dirty_df


def summarize_quality(df, title):
    print(f"\n{title}")
    print("-" * len(title))
    print(f"Shape: {df.shape}")
    print("\nMissing values:")
    print(df.isna().sum())
    print(f"\nDuplicate rows: {df.duplicated().sum()}")
    print("\nData types:")
    print(df.dtypes)


def handle_missing_values(df):
    cleaned_df = df.copy()
    numeric_columns = [
        "Price",
        "Rating",
        "NumberOfReviews",
        "StockQuantity",
        "DiscountPercentage",
        "WarrantyMonths",
        "SoldUnits",
    ]

    for column in numeric_columns:
        cleaned_df[column] = pd.to_numeric(cleaned_df[column], errors="coerce")
        cleaned_df[column] = cleaned_df[column].fillna(cleaned_df[column].median())

    categorical_columns = ["ProductName", "Category", "Brand", "DemandLevel"]
    for column in categorical_columns:
        cleaned_df[column] = cleaned_df[column].fillna(cleaned_df[column].mode()[0])

    return cleaned_df


def cap_outliers_iqr(df, columns):
    capped_df = df.copy()
    outlier_summary = {}

    for column in columns:
        q1 = capped_df[column].quantile(0.25)
        q3 = capped_df[column].quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        outlier_count = ((capped_df[column] < lower_bound) | (capped_df[column] > upper_bound)).sum()
        capped_df[column] = capped_df[column].clip(lower=lower_bound, upper=upper_bound)
        outlier_summary[column] = {
            "lower_bound": round(lower_bound, 2),
            "upper_bound": round(upper_bound, 2),
            "outliers_capped": int(outlier_count),
        }

    return capped_df, outlier_summary


def clean_dataset(df):
    cleaned_df = df.copy()
    cleaned_df = cleaned_df.drop_duplicates()
    cleaned_df = handle_missing_values(cleaned_df)

    integer_columns = ["NumberOfReviews", "StockQuantity", "DiscountPercentage", "WarrantyMonths", "SoldUnits"]
    outlier_columns = ["Price", "Rating", "NumberOfReviews", "StockQuantity", "DiscountPercentage", "WarrantyMonths", "SoldUnits"]
    cleaned_df, outlier_summary = cap_outliers_iqr(cleaned_df, outlier_columns)

    cleaned_df["Rating"] = cleaned_df["Rating"].clip(1.0, 5.0).round(1)
    cleaned_df["Price"] = cleaned_df["Price"].round(2)
    cleaned_df[integer_columns] = cleaned_df[integer_columns].round().astype(int)
    cleaned_df["ProductID"] = cleaned_df["ProductID"].astype(str)

    return cleaned_df, outlier_summary


def plot_dataset_quality(raw_df, cleaned_df, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    sns.set_theme(style="whitegrid", palette="Set2")

    plt.figure(figsize=(10, 5))
    missing_percent = raw_df.isna().mean().sort_values(ascending=False) * 100
    sns.barplot(x=missing_percent.values, y=missing_percent.index)
    plt.title("Missing Values Before Cleaning")
    plt.xlabel("Missing Values (%)")
    plt.ylabel("Column")
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "01_missing_values_before_cleaning.png"), dpi=160)
    plt.close()

    plt.figure(figsize=(7, 5))
    duplicate_counts = pd.Series(
        {"Before Cleaning": raw_df.duplicated().sum(), "After Cleaning": cleaned_df.duplicated().sum()}
    )
    sns.barplot(x=duplicate_counts.index, y=duplicate_counts.values)
    plt.title("Duplicate Rows Before vs After Cleaning")
    plt.ylabel("Duplicate Rows")
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "02_duplicate_rows.png"), dpi=160)
    plt.close()

    numeric_columns = ["Price", "Rating", "NumberOfReviews", "StockQuantity", "DiscountPercentage", "WarrantyMonths", "SoldUnits"]
    fig, axes = plt.subplots(2, 4, figsize=(18, 8))
    axes = axes.flatten()
    for index, column in enumerate(numeric_columns):
        sns.boxplot(y=raw_df[column], ax=axes[index], color="#f4a261")
        axes[index].set_title(f"{column} Before Cleaning")
    axes[-1].axis("off")
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "03_outliers_before_cleaning.png"), dpi=160)
    plt.close()

    fig, axes = plt.subplots(2, 4, figsize=(18, 8))
    axes = axes.flatten()
    for index, column in enumerate(numeric_columns):
        sns.boxplot(y=cleaned_df[column], ax=axes[index], color="#2a9d8f")
        axes[index].set_title(f"{column} After Cleaning")
    axes[-1].axis("off")
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "04_outliers_after_cleaning.png"), dpi=160)
    plt.close()

    plt.figure(figsize=(8, 5))
    sns.countplot(data=cleaned_df, x="DemandLevel", order=["Low", "Medium", "High"])
    plt.title("Target Class Distribution")
    plt.xlabel("Demand Level")
    plt.ylabel("Product Count")
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "05_demand_level_distribution.png"), dpi=160)
    plt.close()

    plt.figure(figsize=(10, 6))
    correlation_matrix = cleaned_df[numeric_columns].corr()
    sns.heatmap(correlation_matrix, annot=True, cmap="coolwarm", fmt=".2f", linewidths=0.5)
    plt.title("Numeric Feature Correlation After Cleaning")
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "06_numeric_correlation_heatmap.png"), dpi=160)
    plt.close()

    plt.figure(figsize=(11, 6))
    sns.countplot(data=cleaned_df, y="Category", hue="DemandLevel", hue_order=["Low", "Medium", "High"])
    plt.title("Demand Level by Product Category")
    plt.xlabel("Product Count")
    plt.ylabel("Category")
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "07_demand_by_category.png"), dpi=160)
    plt.close()


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    base_df = create_dataset()
    raw_df = inject_quality_issues(base_df)
    cleaned_df, outlier_summary = clean_dataset(raw_df)

    raw_path = os.path.join(OUTPUT_DIR, "electronic_online_shop_raw.csv")
    cleaned_path = os.path.join(OUTPUT_DIR, "electronic_online_shop_cleaned.csv")
    raw_df.to_csv(raw_path, index=False)
    cleaned_df.to_csv(cleaned_path, index=False)

    summarize_quality(raw_df, "Raw Dataset Quality Report")
    summarize_quality(cleaned_df, "Cleaned Dataset Quality Report")

    print("\nOutlier handling summary using IQR capping:")
    print(pd.DataFrame(outlier_summary).T)

    print("\nDemand level distribution after cleaning:")
    print(cleaned_df["DemandLevel"].value_counts())

    print("\nCleaned dataset preview:")
    print(cleaned_df.head(10))

    plot_dataset_quality(raw_df, cleaned_df, OUTPUT_DIR)

    print(f"\nFiles created in: {os.path.abspath(OUTPUT_DIR)}")
    print(f"Raw dataset: {os.path.abspath(raw_path)}")
    print(f"Cleaned dataset: {os.path.abspath(cleaned_path)}")


if __name__ == "__main__":
    main()
