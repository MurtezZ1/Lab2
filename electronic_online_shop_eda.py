import os

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns


DATASET_PATH = os.path.join("electronic_online_shop_output", "electronic_online_shop_cleaned.csv")
EDA_OUTPUT_DIR = os.path.join("electronic_online_shop_output", "eda")


def save_plot(file_name):
    plt.tight_layout()
    plt.savefig(os.path.join(EDA_OUTPUT_DIR, file_name), dpi=180, bbox_inches="tight")
    plt.close()


def currency(value):
    return f"${value:,.2f}"


def create_eda_report(df, numeric_columns, report_values):
    report_path = os.path.join(EDA_OUTPUT_DIR, "eda_report.md")
    lines = [
        "# Electronic Online Shop - Exploratory Data Analysis",
        "",
        "## Dataset Overview",
        f"- Rows: {df.shape[0]:,}",
        f"- Columns: {df.shape[1]:,}",
        f"- Duplicate rows: {df.duplicated().sum():,}",
        f"- Missing values: {df.isna().sum().sum():,}",
        f"- Target column: `DemandLevel`",
        f"- Target classes: {', '.join(sorted(df['DemandLevel'].unique()))}",
        "",
        "## Statistical Summary",
        f"- Average price: {currency(report_values['avg_price'])}",
        f"- Median price: {currency(report_values['median_price'])}",
        f"- Average rating: {report_values['avg_rating']:.2f} / 5",
        f"- Average sold units: {report_values['avg_sold_units']:.0f}",
        f"- Total sold units: {report_values['total_sold_units']:,}",
        f"- Average discount: {report_values['avg_discount']:.1f}%",
        "",
        "## Main Findings",
        f"- The largest category is **{report_values['top_category']}**, with {report_values['top_category_count']:,} products.",
        f"- The most frequent brand is **{report_values['top_brand']}**, with {report_values['top_brand_count']:,} products.",
        f"- The most common demand level is **{report_values['top_demand']}**, with {report_values['top_demand_count']:,} products.",
        f"- The highest selling category by total units is **{report_values['best_sales_category']}**.",
        f"- Products with **High** demand have an average rating of {report_values['high_demand_avg_rating']:.2f}, compared with {report_values['low_demand_avg_rating']:.2f} for **Low** demand products.",
        f"- The strongest numeric relationship with `SoldUnits` is **{report_values['strongest_sales_corr_feature']}** with correlation {report_values['strongest_sales_corr_value']:.2f}.",
        "",
        "## Charts Generated",
        "- `01_correlation_matrix.png`",
        "- `02_category_distribution.png`",
        "- `03_brand_distribution_top15.png`",
        "- `04_price_distribution.png`",
        "- `05_demand_level_distribution.png`",
        "- `06_rating_analysis.png`",
        "- `07_sales_by_category.png`",
        "- `08_sales_by_demand_level.png`",
        "- `09_price_vs_sold_units.png`",
        "- `10_discount_vs_demand.png`",
        "",
        "## Interpretation",
        "The dataset is clean and ready for Machine Learning experiments. There are no missing values or duplicate records in the cleaned dataset. Demand level is suitable as a classification target, while price, rating, reviews, discounts, warranty, stock, and sold units provide useful numeric features for analysis and model training.",
    ]
    with open(report_path, "w", encoding="utf-8") as file:
        file.write("\n".join(lines))
    return report_path


def main():
    os.makedirs(EDA_OUTPUT_DIR, exist_ok=True)
    sns.set_theme(style="whitegrid", palette="Set2")

    df = pd.read_csv(DATASET_PATH)
    numeric_columns = [
        "Price",
        "Rating",
        "NumberOfReviews",
        "StockQuantity",
        "DiscountPercentage",
        "WarrantyMonths",
        "SoldUnits",
    ]

    overview = pd.DataFrame(
        {
            "Column": df.columns,
            "DataType": [str(dtype) for dtype in df.dtypes],
            "MissingValues": df.isna().sum().values,
            "UniqueValues": df.nunique().values,
        }
    )
    overview.to_csv(os.path.join(EDA_OUTPUT_DIR, "dataset_overview.csv"), index=False)
    df[numeric_columns].describe().T.to_csv(os.path.join(EDA_OUTPUT_DIR, "statistical_summary.csv"))

    plt.figure(figsize=(10, 7))
    sns.heatmap(df[numeric_columns].corr(), annot=True, cmap="coolwarm", fmt=".2f", linewidths=0.5)
    plt.title("Correlation Matrix of Numeric Features", fontsize=15, weight="bold")
    save_plot("01_correlation_matrix.png")

    plt.figure(figsize=(11, 6))
    category_counts = df["Category"].value_counts()
    sns.barplot(x=category_counts.values, y=category_counts.index, hue=category_counts.index, legend=False)
    plt.title("Category Distribution", fontsize=15, weight="bold")
    plt.xlabel("Number of Products")
    plt.ylabel("Category")
    save_plot("02_category_distribution.png")

    plt.figure(figsize=(11, 6))
    brand_counts = df["Brand"].value_counts().head(15)
    sns.barplot(x=brand_counts.values, y=brand_counts.index, hue=brand_counts.index, legend=False)
    plt.title("Top 15 Brand Distribution", fontsize=15, weight="bold")
    plt.xlabel("Number of Products")
    plt.ylabel("Brand")
    save_plot("03_brand_distribution_top15.png")

    plt.figure(figsize=(11, 6))
    sns.histplot(df["Price"], bins=35, kde=True, color="#2a9d8f")
    plt.axvline(df["Price"].mean(), color="#e76f51", linestyle="--", label=f"Mean: {currency(df['Price'].mean())}")
    plt.axvline(df["Price"].median(), color="#264653", linestyle="--", label=f"Median: {currency(df['Price'].median())}")
    plt.title("Price Distribution", fontsize=15, weight="bold")
    plt.xlabel("Price")
    plt.ylabel("Product Count")
    plt.legend()
    save_plot("04_price_distribution.png")

    plt.figure(figsize=(8, 6))
    demand_order = ["Low", "Medium", "High"]
    sns.countplot(data=df, x="DemandLevel", order=demand_order, hue="DemandLevel", palette="Set2", legend=False)
    plt.title("Demand Level Distribution", fontsize=15, weight="bold")
    plt.xlabel("Demand Level")
    plt.ylabel("Product Count")
    save_plot("05_demand_level_distribution.png")

    fig, axes = plt.subplots(1, 2, figsize=(14, 6))
    sns.histplot(df["Rating"], bins=18, kde=True, ax=axes[0], color="#457b9d")
    axes[0].set_title("Rating Distribution", fontsize=13, weight="bold")
    axes[0].set_xlabel("Rating")
    sns.boxplot(data=df, x="DemandLevel", y="Rating", order=demand_order, ax=axes[1], palette="Set2", hue="DemandLevel", legend=False)
    axes[1].set_title("Rating by Demand Level", fontsize=13, weight="bold")
    axes[1].set_xlabel("Demand Level")
    axes[1].set_ylabel("Rating")
    save_plot("06_rating_analysis.png")

    plt.figure(figsize=(12, 6))
    sales_by_category = df.groupby("Category", as_index=False)["SoldUnits"].sum().sort_values("SoldUnits", ascending=False)
    sns.barplot(data=sales_by_category, x="SoldUnits", y="Category", hue="Category", legend=False)
    plt.title("Total Sold Units by Category", fontsize=15, weight="bold")
    plt.xlabel("Total Sold Units")
    plt.ylabel("Category")
    save_plot("07_sales_by_category.png")

    plt.figure(figsize=(9, 6))
    sales_by_demand = df.groupby("DemandLevel", as_index=False)["SoldUnits"].sum()
    sales_by_demand["DemandLevel"] = pd.Categorical(sales_by_demand["DemandLevel"], categories=demand_order, ordered=True)
    sales_by_demand = sales_by_demand.sort_values("DemandLevel")
    sns.barplot(data=sales_by_demand, x="DemandLevel", y="SoldUnits", hue="DemandLevel", palette="Set2", legend=False)
    plt.title("Total Sold Units by Demand Level", fontsize=15, weight="bold")
    plt.xlabel("Demand Level")
    plt.ylabel("Total Sold Units")
    save_plot("08_sales_by_demand_level.png")

    plt.figure(figsize=(11, 6))
    sns.scatterplot(data=df, x="Price", y="SoldUnits", hue="DemandLevel", hue_order=demand_order, alpha=0.72)
    plt.title("Price vs Sold Units", fontsize=15, weight="bold")
    plt.xlabel("Price")
    plt.ylabel("Sold Units")
    save_plot("09_price_vs_sold_units.png")

    plt.figure(figsize=(10, 6))
    sns.boxplot(data=df, x="DemandLevel", y="DiscountPercentage", order=demand_order, hue="DemandLevel", palette="Set2", legend=False)
    plt.title("Discount Percentage by Demand Level", fontsize=15, weight="bold")
    plt.xlabel("Demand Level")
    plt.ylabel("Discount Percentage")
    save_plot("10_discount_vs_demand.png")

    demand_counts = df["DemandLevel"].value_counts()
    category_counts = df["Category"].value_counts()
    brand_counts = df["Brand"].value_counts()
    sales_corr = df[numeric_columns].corr()["SoldUnits"].drop("SoldUnits").abs().sort_values(ascending=False)
    rating_by_demand = df.groupby("DemandLevel")["Rating"].mean()
    sales_by_category = df.groupby("Category")["SoldUnits"].sum().sort_values(ascending=False)

    report_values = {
        "avg_price": df["Price"].mean(),
        "median_price": df["Price"].median(),
        "avg_rating": df["Rating"].mean(),
        "avg_sold_units": df["SoldUnits"].mean(),
        "total_sold_units": int(df["SoldUnits"].sum()),
        "avg_discount": df["DiscountPercentage"].mean(),
        "top_category": category_counts.index[0],
        "top_category_count": int(category_counts.iloc[0]),
        "top_brand": brand_counts.index[0],
        "top_brand_count": int(brand_counts.iloc[0]),
        "top_demand": demand_counts.index[0],
        "top_demand_count": int(demand_counts.iloc[0]),
        "best_sales_category": sales_by_category.index[0],
        "high_demand_avg_rating": rating_by_demand.get("High", 0),
        "low_demand_avg_rating": rating_by_demand.get("Low", 0),
        "strongest_sales_corr_feature": sales_corr.index[0],
        "strongest_sales_corr_value": df[numeric_columns].corr()["SoldUnits"][sales_corr.index[0]],
    }
    report_path = create_eda_report(df, numeric_columns, report_values)

    print("EDA completed successfully.")
    print(f"Dataset rows: {df.shape[0]}")
    print(f"Dataset columns: {df.shape[1]}")
    print(f"Missing values: {df.isna().sum().sum()}")
    print(f"Duplicate rows: {df.duplicated().sum()}")
    print(f"Report created: {os.path.abspath(report_path)}")
    print(f"Charts created in: {os.path.abspath(EDA_OUTPUT_DIR)}")


if __name__ == "__main__":
    main()
