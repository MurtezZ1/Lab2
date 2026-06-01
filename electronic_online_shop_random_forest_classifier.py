import os
import pickle

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, StandardScaler
from sklearn.tree import DecisionTreeClassifier


DATASET_PATH = os.path.join("electronic_online_shop_output", "electronic_online_shop_cleaned.csv")
OUTPUT_DIR = os.path.join("electronic_online_shop_output", "random_forest_classifier")


def save_plot(file_name):
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, file_name), dpi=180, bbox_inches="tight")
    plt.close()


def build_preprocessor(X, scale_numeric=False):
    numeric_features = X.select_dtypes(include=["int64", "float64"]).columns.tolist()
    categorical_features = X.select_dtypes(include=["object", "string"]).columns.tolist()

    numeric_transformer = StandardScaler() if scale_numeric else "passthrough"
    categorical_transformer = OneHotEncoder(handle_unknown="ignore", sparse_output=False)

    preprocessor = ColumnTransformer(
        transformers=[
            ("numeric", numeric_transformer, numeric_features),
            ("categorical", categorical_transformer, categorical_features),
        ]
    )

    return preprocessor, numeric_features, categorical_features


def get_feature_names(preprocessor, numeric_features, categorical_features):
    encoded_categorical_names = (
        preprocessor.named_transformers_["categorical"].get_feature_names_out(categorical_features).tolist()
    )
    return numeric_features + encoded_categorical_names


def evaluate_model(model, X_test, y_test, label_names):
    y_pred = model.predict(X_test)
    metrics = {
        "accuracy": accuracy_score(y_test, y_pred),
        "precision_macro": precision_score(y_test, y_pred, average="macro", zero_division=0),
        "recall_macro": recall_score(y_test, y_pred, average="macro", zero_division=0),
        "f1_macro": f1_score(y_test, y_pred, average="macro", zero_division=0),
        "precision_weighted": precision_score(y_test, y_pred, average="weighted", zero_division=0),
        "recall_weighted": recall_score(y_test, y_pred, average="weighted", zero_division=0),
        "f1_weighted": f1_score(y_test, y_pred, average="weighted", zero_division=0),
    }
    report = classification_report(y_test, y_pred, target_names=label_names, zero_division=0)
    matrix = confusion_matrix(y_test, y_pred)
    return y_pred, metrics, report, matrix


def tune_model(name, pipeline, param_grid, X_train, y_train):
    search = GridSearchCV(
        estimator=pipeline,
        param_grid=param_grid,
        scoring="f1_weighted",
        cv=5,
        n_jobs=-1,
        return_train_score=True,
    )
    search.fit(X_train, y_train)

    results = pd.DataFrame(search.cv_results_).sort_values("rank_test_score")
    results.to_csv(os.path.join(OUTPUT_DIR, f"{name}_cv_results.csv"), index=False)
    return search, results


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

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y_encoded,
        test_size=0.20,
        random_state=42,
        stratify=y_encoded,
    )

    tree_preprocessor, numeric_features, categorical_features = build_preprocessor(X, scale_numeric=False)
    knn_preprocessor, _, _ = build_preprocessor(X, scale_numeric=True)

    random_forest_pipeline = Pipeline(
        steps=[
            ("preprocessor", tree_preprocessor),
            (
                "classifier",
                RandomForestClassifier(random_state=42, class_weight="balanced", n_jobs=-1),
            ),
        ]
    )
    random_forest_grid = {
        "classifier__n_estimators": [100, 200],
        "classifier__max_depth": [5, 10, None],
        "classifier__min_samples_split": [2, 10],
        "classifier__min_samples_leaf": [1, 5],
        "classifier__max_features": ["sqrt", "log2"],
    }

    decision_tree_pipeline = Pipeline(
        steps=[
            ("preprocessor", tree_preprocessor),
            ("classifier", DecisionTreeClassifier(random_state=42, class_weight="balanced")),
        ]
    )
    decision_tree_grid = {
        "classifier__max_depth": [3, 5, 8, None],
        "classifier__min_samples_split": [2, 10],
        "classifier__min_samples_leaf": [1, 5],
    }

    knn_pipeline = Pipeline(
        steps=[
            ("preprocessor", knn_preprocessor),
            ("classifier", KNeighborsClassifier()),
        ]
    )
    knn_grid = {
        "classifier__n_neighbors": [5, 9, 15, 21],
        "classifier__weights": ["uniform", "distance"],
        "classifier__metric": ["euclidean", "manhattan"],
    }

    rf_search, rf_results = tune_model("random_forest", random_forest_pipeline, random_forest_grid, X_train, y_train)
    dt_search, _ = tune_model("decision_tree_fair_comparison", decision_tree_pipeline, decision_tree_grid, X_train, y_train)
    knn_search, _ = tune_model("knn_fair_comparison", knn_pipeline, knn_grid, X_train, y_train)

    model_searches = {
        "Random Forest": rf_search,
        "Decision Tree": dt_search,
        "KNN": knn_search,
    }

    comparison_rows = []
    confusion_matrices = {}
    reports = {}

    for model_name, search in model_searches.items():
        best_model = search.best_estimator_
        y_pred, metrics, report, matrix = evaluate_model(best_model, X_test, y_test, label_names)

        comparison_rows.append(
            {
                "Model": model_name,
                "BestParameters": search.best_params_,
                "BestCVF1Weighted": search.best_score_,
                **metrics,
            }
        )
        confusion_matrices[model_name] = pd.DataFrame(matrix, index=label_names, columns=label_names)
        reports[model_name] = report

    comparison_df = pd.DataFrame(comparison_rows).sort_values("f1_weighted", ascending=False)
    comparison_df.to_csv(os.path.join(OUTPUT_DIR, "model_comparison_knn_decision_tree_random_forest.csv"), index=False)

    best_rf_model = rf_search.best_estimator_
    rf_y_pred, rf_metrics, rf_report, rf_matrix = evaluate_model(best_rf_model, X_test, y_test, label_names)

    pd.DataFrame([rf_metrics]).to_csv(os.path.join(OUTPUT_DIR, "random_forest_test_metrics.csv"), index=False)
    pd.DataFrame(classification_report(y_test, rf_y_pred, target_names=label_names, output_dict=True)).T.to_csv(
        os.path.join(OUTPUT_DIR, "random_forest_classification_report.csv")
    )
    rf_matrix_df = pd.DataFrame(rf_matrix, index=label_names, columns=label_names)
    rf_matrix_df.to_csv(os.path.join(OUTPUT_DIR, "random_forest_confusion_matrix.csv"))

    with open(os.path.join(OUTPUT_DIR, "best_random_forest_model.pkl"), "wb") as file:
        pickle.dump(best_rf_model, file)

    fitted_preprocessor = best_rf_model.named_steps["preprocessor"]
    fitted_forest = best_rf_model.named_steps["classifier"]
    feature_names = get_feature_names(fitted_preprocessor, numeric_features, categorical_features)
    feature_importance = (
        pd.DataFrame({"Feature": feature_names, "Importance": fitted_forest.feature_importances_})
        .sort_values("Importance", ascending=False)
        .reset_index(drop=True)
    )
    feature_importance.to_csv(os.path.join(OUTPUT_DIR, "random_forest_feature_importance.csv"), index=False)

    plt.figure(figsize=(8, 6))
    sns.heatmap(rf_matrix_df, annot=True, fmt="d", cmap="Purples", linewidths=0.5)
    plt.title("Random Forest Confusion Matrix", fontsize=15, weight="bold")
    plt.xlabel("Predicted Demand Level")
    plt.ylabel("Actual Demand Level")
    save_plot("01_random_forest_confusion_matrix.png")

    top_rf_results = rf_results.head(12).copy()
    top_rf_results["configuration"] = (
        "trees="
        + top_rf_results["param_classifier__n_estimators"].astype(str)
        + ", depth="
        + top_rf_results["param_classifier__max_depth"].astype(str)
        + ", split="
        + top_rf_results["param_classifier__min_samples_split"].astype(str)
        + ", leaf="
        + top_rf_results["param_classifier__min_samples_leaf"].astype(str)
    )
    plt.figure(figsize=(12, 7))
    sns.barplot(data=top_rf_results, x="mean_test_score", y="configuration", hue="configuration", legend=False)
    plt.title("Top Random Forest Hyperparameter Results", fontsize=15, weight="bold")
    plt.xlabel("Mean CV Weighted F1 Score")
    plt.ylabel("Configuration")
    save_plot("02_random_forest_hyperparameter_comparison.png")

    metric_plot_df = pd.DataFrame(
        {
            "Metric": ["Accuracy", "Precision", "Recall", "F1 Score"],
            "Score": [
                rf_metrics["accuracy"],
                rf_metrics["precision_weighted"],
                rf_metrics["recall_weighted"],
                rf_metrics["f1_weighted"],
            ],
        }
    )
    plt.figure(figsize=(8, 5))
    sns.barplot(data=metric_plot_df, x="Metric", y="Score", hue="Metric", legend=False)
    plt.ylim(0, 1)
    plt.title("Random Forest Test Performance Metrics", fontsize=15, weight="bold")
    save_plot("03_random_forest_test_metrics.png")

    top_features = feature_importance.head(15)
    plt.figure(figsize=(12, 7))
    sns.barplot(data=top_features, x="Importance", y="Feature", hue="Feature", legend=False)
    plt.title("Top 15 Random Forest Feature Importances", fontsize=15, weight="bold")
    plt.xlabel("Importance")
    plt.ylabel("Feature")
    save_plot("04_random_forest_feature_importance.png")

    comparison_long = comparison_df.melt(
        id_vars=["Model"],
        value_vars=["accuracy", "precision_weighted", "recall_weighted", "f1_weighted"],
        var_name="Metric",
        value_name="Score",
    )
    plt.figure(figsize=(11, 6))
    sns.barplot(data=comparison_long, x="Metric", y="Score", hue="Model")
    plt.ylim(0, 1)
    plt.title("Model Performance Comparison", fontsize=15, weight="bold")
    save_plot("05_model_comparison.png")

    summary_path = os.path.join(OUTPUT_DIR, "random_forest_summary.txt")
    with open(summary_path, "w", encoding="utf-8") as file:
        file.write("Electronic Online Shop - Random Forest Classifier Summary\n")
        file.write("=" * 62 + "\n\n")
        file.write(f"Dataset shape: {df.shape}\n")
        file.write(f"Feature matrix shape: {X.shape}\n")
        file.write(f"Target classes: {', '.join(label_names)}\n")
        file.write(f"Excluded leakage columns: {leakage_columns}\n")
        file.write(f"Numeric features: {numeric_features}\n")
        file.write(f"Categorical features one hot encoded: {categorical_features}\n\n")
        file.write("Random Forest hyperparameter tuning:\n")
        file.write("- n_estimators: [100, 200]\n")
        file.write("- max_depth: [5, 10, None]\n")
        file.write("- min_samples_split: [2, 10]\n")
        file.write("- min_samples_leaf: [1, 5]\n")
        file.write("- max_features: ['sqrt', 'log2']\n")
        file.write("- scoring: weighted F1 score\n")
        file.write("- cross validation: 5 folds\n\n")
        file.write(f"Best Random Forest parameters: {rf_search.best_params_}\n")
        file.write(f"Best Random Forest CV weighted F1 score: {rf_search.best_score_:.4f}\n\n")
        file.write("Random Forest test metrics:\n")
        for metric_name, metric_value in rf_metrics.items():
            file.write(f"- {metric_name}: {metric_value:.4f}\n")
        file.write("\nRandom Forest classification report:\n")
        file.write(rf_report + "\n")
        file.write("Random Forest confusion matrix:\n")
        file.write(str(rf_matrix_df) + "\n\n")
        file.write("Model comparison against KNN and Decision Tree:\n")
        file.write(comparison_df.to_string(index=False) + "\n\n")
        file.write("Feature importance explanation:\n")
        file.write(
            "Random Forest feature importance estimates how much each feature reduced impurity across all trees. "
            "Higher importance means the feature contributed more strongly to DemandLevel predictions.\n\n"
        )
        file.write("Top 10 important features:\n")
        file.write(feature_importance.head(10).to_string(index=False) + "\n")

    print("Random Forest classifier completed successfully.")
    print(f"Best Random Forest parameters: {rf_search.best_params_}")
    print(f"Best Random Forest CV weighted F1 score: {rf_search.best_score_:.4f}")
    print(f"Random Forest test accuracy: {rf_metrics['accuracy']:.4f}")
    print(f"Random Forest test precision weighted: {rf_metrics['precision_weighted']:.4f}")
    print(f"Random Forest test recall weighted: {rf_metrics['recall_weighted']:.4f}")
    print(f"Random Forest test F1 weighted: {rf_metrics['f1_weighted']:.4f}")
    print("\nModel comparison:")
    print(comparison_df[["Model", "accuracy", "precision_weighted", "recall_weighted", "f1_weighted"]])
    print(f"\nMost important feature: {feature_importance.iloc[0]['Feature']}")
    print(f"Output folder: {os.path.abspath(OUTPUT_DIR)}")


if __name__ == "__main__":
    main()
