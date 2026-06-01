import os

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.preprocessing import LabelEncoder, OneHotEncoder


DATASET_PATH = os.path.join("data", "sunspot_electronic_online_shop.csv")
OUTPUT_DIR = os.path.join("outputs", "sunspot_electronic_online_shop", "feature_selection")
RANDOM_STATE = 42
SELECTED_FEATURE_COUNT = 15


def save_plot(file_name):
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, file_name), dpi=180, bbox_inches="tight")
    plt.close()


def build_preprocessor(X):
    numeric_features = X.select_dtypes(include=["int64", "float64"]).columns.tolist()
    categorical_features = X.select_dtypes(include=["object", "string"]).columns.tolist()

    preprocessor = ColumnTransformer(
        transformers=[
            ("numeric", "passthrough", numeric_features),
            ("categorical", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features),
        ]
    )
    return preprocessor, numeric_features, categorical_features


def get_feature_names(preprocessor, numeric_features, categorical_features):
    encoded_categorical_names = (
        preprocessor.named_transformers_["categorical"].get_feature_names_out(categorical_features).tolist()
    )
    return numeric_features + encoded_categorical_names


def evaluate_feature_set(name, X_train, X_test, y_train, y_test, label_names, selected_features):
    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=None,
        min_samples_split=10,
        min_samples_leaf=1,
        max_features="log2",
        class_weight="balanced",
        random_state=RANDOM_STATE,
        n_jobs=-1,
    )

    cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring="f1_weighted", n_jobs=-1)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    metrics = {
        "FeatureSet": name,
        "NumberOfFeatures": X_train.shape[1],
        "SelectedFeatures": ", ".join(selected_features),
        "CVF1WeightedMean": cv_scores.mean(),
        "CVF1WeightedStd": cv_scores.std(),
        "Accuracy": accuracy_score(y_test, y_pred),
        "PrecisionWeighted": precision_score(y_test, y_pred, average="weighted", zero_division=0),
        "RecallWeighted": recall_score(y_test, y_pred, average="weighted", zero_division=0),
        "F1Weighted": f1_score(y_test, y_pred, average="weighted", zero_division=0),
        "PrecisionMacro": precision_score(y_test, y_pred, average="macro", zero_division=0),
        "RecallMacro": recall_score(y_test, y_pred, average="macro", zero_division=0),
        "F1Macro": f1_score(y_test, y_pred, average="macro", zero_division=0),
    }

    report = classification_report(y_test, y_pred, target_names=label_names, zero_division=0)
    matrix = pd.DataFrame(confusion_matrix(y_test, y_pred), index=label_names, columns=label_names)

    return model, metrics, report, matrix


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    sns.set_theme(style="whitegrid", palette="Set2")

    df = pd.read_csv(DATASET_PATH)

    target_column = "DemandLevel"
    leakage_columns = ["SoldUnits"]
    X = df.drop(columns=["ProductID", "ProductName", target_column] + leakage_columns)
    y = df[target_column]

    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    label_names = label_encoder.classes_

    X_train_raw, X_test_raw, y_train, y_test = train_test_split(
        X,
        y_encoded,
        test_size=0.20,
        random_state=RANDOM_STATE,
        stratify=y_encoded,
    )

    preprocessor, numeric_features, categorical_features = build_preprocessor(X)
    X_train_processed = preprocessor.fit_transform(X_train_raw)
    X_test_processed = preprocessor.transform(X_test_raw)
    feature_names = get_feature_names(preprocessor, numeric_features, categorical_features)

    X_train_df = pd.DataFrame(X_train_processed, columns=feature_names)
    X_test_df = pd.DataFrame(X_test_processed, columns=feature_names)

    all_features = feature_names

    select_k_best = SelectKBest(score_func=f_classif, k=min(SELECTED_FEATURE_COUNT, len(feature_names)))
    select_k_best.fit(X_train_df, y_train)
    select_k_best_scores = pd.DataFrame(
        {
            "Feature": feature_names,
            "Score": select_k_best.scores_,
            "PValue": select_k_best.pvalues_,
            "Selected": select_k_best.get_support(),
        }
    ).sort_values("Score", ascending=False)
    select_k_best_features = select_k_best_scores.loc[select_k_best_scores["Selected"], "Feature"].tolist()
    select_k_best_scores.to_csv(os.path.join(OUTPUT_DIR, "select_k_best_scores.csv"), index=False)

    correlation_scores = []
    train_with_target = X_train_df.copy()
    train_with_target["DemandLevelEncoded"] = y_train
    for feature in feature_names:
        correlation = train_with_target[feature].corr(train_with_target["DemandLevelEncoded"])
        correlation_scores.append({"Feature": feature, "CorrelationWithTarget": correlation, "AbsCorrelation": abs(correlation)})
    correlation_df = pd.DataFrame(correlation_scores).sort_values("AbsCorrelation", ascending=False)
    correlation_features = correlation_df.head(SELECTED_FEATURE_COUNT)["Feature"].tolist()
    correlation_df.to_csv(os.path.join(OUTPUT_DIR, "correlation_analysis_scores.csv"), index=False)

    rf_selector = RandomForestClassifier(
        n_estimators=250,
        max_depth=None,
        min_samples_split=10,
        min_samples_leaf=1,
        max_features="log2",
        class_weight="balanced",
        random_state=RANDOM_STATE,
        n_jobs=-1,
    )
    rf_selector.fit(X_train_df, y_train)
    rf_importance_df = (
        pd.DataFrame({"Feature": feature_names, "Importance": rf_selector.feature_importances_})
        .sort_values("Importance", ascending=False)
        .reset_index(drop=True)
    )
    rf_importance_features = rf_importance_df.head(SELECTED_FEATURE_COUNT)["Feature"].tolist()
    rf_importance_df.to_csv(os.path.join(OUTPUT_DIR, "random_forest_feature_importance_selection.csv"), index=False)

    feature_sets = {
        "All Features": all_features,
        "SelectKBest": select_k_best_features,
        "Correlation Analysis": correlation_features,
        "Random Forest Importance": rf_importance_features,
    }

    comparison_rows = []
    reports = {}
    matrices = {}

    for feature_set_name, selected_features in feature_sets.items():
        model, metrics, report, matrix = evaluate_feature_set(
            feature_set_name,
            X_train_df[selected_features],
            X_test_df[selected_features],
            y_train,
            y_test,
            label_names,
            selected_features,
        )
        comparison_rows.append(metrics)
        reports[feature_set_name] = report
        matrices[feature_set_name] = matrix

        safe_name = feature_set_name.lower().replace(" ", "_")
        matrix.to_csv(os.path.join(OUTPUT_DIR, f"{safe_name}_confusion_matrix.csv"))

    comparison_df = pd.DataFrame(comparison_rows).sort_values("F1Weighted", ascending=False)
    comparison_df.to_csv(os.path.join(OUTPUT_DIR, "feature_selection_model_comparison.csv"), index=False)

    selected_feature_table = pd.DataFrame(
        [
            {"Method": method, "Feature": feature, "Rank": rank + 1}
            for method, features in feature_sets.items()
            for rank, feature in enumerate(features)
        ]
    )
    selected_feature_table.to_csv(os.path.join(OUTPUT_DIR, "selected_features_by_method.csv"), index=False)

    plt.figure(figsize=(12, 6))
    comparison_plot_df = comparison_df.melt(
        id_vars=["FeatureSet"],
        value_vars=["Accuracy", "PrecisionWeighted", "RecallWeighted", "F1Weighted"],
        var_name="Metric",
        value_name="Score",
    )
    sns.barplot(data=comparison_plot_df, x="Metric", y="Score", hue="FeatureSet")
    plt.ylim(0, 1)
    plt.title("Model Performance: All Features vs Selected Features", fontsize=15, weight="bold")
    save_plot("01_all_vs_selected_features_performance.png")

    plt.figure(figsize=(12, 7))
    top_kbest = select_k_best_scores.head(15)
    sns.barplot(data=top_kbest, x="Score", y="Feature", hue="Feature", legend=False)
    plt.title("SelectKBest Top Feature Scores", fontsize=15, weight="bold")
    save_plot("02_select_k_best_scores.png")

    plt.figure(figsize=(12, 7))
    top_corr = correlation_df.head(15)
    sns.barplot(data=top_corr, x="AbsCorrelation", y="Feature", hue="Feature", legend=False)
    plt.title("Top Features by Absolute Correlation with DemandLevel", fontsize=15, weight="bold")
    save_plot("03_correlation_analysis_scores.png")

    plt.figure(figsize=(12, 7))
    top_rf = rf_importance_df.head(15)
    sns.barplot(data=top_rf, x="Importance", y="Feature", hue="Feature", legend=False)
    plt.title("Random Forest Feature Importance Selection", fontsize=15, weight="bold")
    save_plot("04_random_forest_feature_importance_selection.png")

    best_feature_set = comparison_df.iloc[0]["FeatureSet"]
    plt.figure(figsize=(8, 6))
    sns.heatmap(matrices[best_feature_set], annot=True, fmt="d", cmap="Blues", linewidths=0.5)
    plt.title(f"Best Feature Set Confusion Matrix: {best_feature_set}", fontsize=15, weight="bold")
    plt.xlabel("Predicted Demand Level")
    plt.ylabel("Actual Demand Level")
    save_plot("05_best_feature_set_confusion_matrix.png")

    all_f1 = comparison_df.loc[comparison_df["FeatureSet"] == "All Features", "F1Weighted"].iloc[0]
    best_f1 = comparison_df["F1Weighted"].iloc[0]
    best_feature_count = int(comparison_df.iloc[0]["NumberOfFeatures"])
    all_feature_count = len(all_features)
    improvement = best_f1 - all_f1

    summary_path = os.path.join(OUTPUT_DIR, "feature_selection_summary.txt")
    with open(summary_path, "w", encoding="utf-8") as file:
        file.write("Electronic Online Shop - Feature Selection Summary\n")
        file.write("=" * 55 + "\n\n")
        file.write(f"Dataset shape: {df.shape}\n")
        file.write(f"Original valid feature count after preprocessing: {all_feature_count}\n")
        file.write(f"Excluded leakage columns: {leakage_columns}\n")
        file.write(f"Target classes: {', '.join(label_names)}\n\n")
        file.write("Feature selection methods used:\n")
        file.write("- SelectKBest with ANOVA F-score\n")
        file.write("- Correlation Analysis with encoded DemandLevel\n")
        file.write("- Random Forest Feature Importance\n\n")
        file.write("Model performance comparison:\n")
        file.write(
            comparison_df[
                [
                    "FeatureSet",
                    "NumberOfFeatures",
                    "CVF1WeightedMean",
                    "Accuracy",
                    "PrecisionWeighted",
                    "RecallWeighted",
                    "F1Weighted",
                ]
            ].to_string(index=False)
        )
        file.write("\n\n")
        file.write(f"Best feature set: {best_feature_set}\n")
        file.write(f"Best weighted F1 score: {best_f1:.4f}\n")
        file.write(f"All-features weighted F1 score: {all_f1:.4f}\n")
        file.write(f"F1 improvement over all features: {improvement:+.4f}\n")
        file.write(f"Feature count changed from {all_feature_count} to {best_feature_count}.\n\n")
        file.write("Discussion:\n")
        if improvement > 0:
            file.write(
                "Selected features improved model performance. This suggests that removing weaker or noisy encoded features "
                "helped the classifier focus on stronger demand signals.\n"
            )
        elif improvement < 0:
            file.write(
                "Selected features did not improve the best test F1 score compared with using all features. "
                "However, feature selection still reduces dimensionality and improves interpretability.\n"
            )
        else:
            file.write(
                "Selected features matched the all-feature performance. This means a smaller feature set can preserve predictive quality.\n"
            )
        file.write(
            "Important demand predictors consistently include price, rating, number of reviews, discount percentage, stock quantity, "
            "and warranty months. SoldUnits was excluded because it is too directly connected to DemandLevel and would create target leakage.\n\n"
        )
        file.write("Classification reports:\n")
        for feature_set_name, report in reports.items():
            file.write(f"\n--- {feature_set_name} ---\n")
            file.write(report + "\n")

    print("Feature selection completed successfully.")
    print(f"Best feature set: {best_feature_set}")
    print(f"All features weighted F1: {all_f1:.4f}")
    print(f"Best selected weighted F1: {best_f1:.4f}")
    print(f"Improvement: {improvement:+.4f}")
    print(f"Output folder: {os.path.abspath(OUTPUT_DIR)}")
    print("\nPerformance comparison:")
    print(comparison_df[["FeatureSet", "NumberOfFeatures", "Accuracy", "PrecisionWeighted", "RecallWeighted", "F1Weighted"]])


if __name__ == "__main__":
    main()
