import os
import pickle

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from sklearn.compose import ColumnTransformer
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    precision_score,
    recall_score,
    f1_score,
)
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, StandardScaler


DATASET_PATH = os.path.join("electronic_online_shop_output", "electronic_online_shop_cleaned.csv")
OUTPUT_DIR = os.path.join("electronic_online_shop_output", "knn_classifier")


def save_plot(file_name):
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, file_name), dpi=180, bbox_inches="tight")
    plt.close()


def build_preprocessor(X):
    numeric_features = X.select_dtypes(include=["int64", "float64"]).columns.tolist()
    categorical_features = X.select_dtypes(include=["object", "string"]).columns.tolist()

    numeric_transformer = Pipeline(
        steps=[
            ("scaler", StandardScaler()),
        ]
    )

    categorical_transformer = Pipeline(
        steps=[
            ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("numeric", numeric_transformer, numeric_features),
            ("categorical", categorical_transformer, categorical_features),
        ]
    )

    return preprocessor, numeric_features, categorical_features


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


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    sns.set_theme(style="whitegrid", palette="Set2")

    df = pd.read_csv(DATASET_PATH)

    target_column = "DemandLevel"
    X = df.drop(columns=["ProductID", "ProductName", target_column])
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

    preprocessor, numeric_features, categorical_features = build_preprocessor(X)

    knn_pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("classifier", KNeighborsClassifier()),
        ]
    )

    param_grid = {
        "classifier__n_neighbors": [3, 5, 7, 9, 11, 15, 21],
        "classifier__weights": ["uniform", "distance"],
        "classifier__metric": ["euclidean", "manhattan", "minkowski"],
    }

    grid_search = GridSearchCV(
        estimator=knn_pipeline,
        param_grid=param_grid,
        scoring="f1_weighted",
        cv=5,
        n_jobs=-1,
        return_train_score=True,
    )

    grid_search.fit(X_train, y_train)

    results = pd.DataFrame(grid_search.cv_results_)
    comparison_columns = [
        "param_classifier__n_neighbors",
        "param_classifier__weights",
        "param_classifier__metric",
        "mean_train_score",
        "mean_test_score",
        "std_test_score",
        "rank_test_score",
    ]
    comparison = results[comparison_columns].sort_values("rank_test_score").rename(
        columns={
            "param_classifier__n_neighbors": "n_neighbors",
            "param_classifier__weights": "weights",
            "param_classifier__metric": "metric",
            "mean_train_score": "mean_cv_train_f1_weighted",
            "mean_test_score": "mean_cv_test_f1_weighted",
            "std_test_score": "std_cv_test_f1_weighted",
            "rank_test_score": "rank",
        }
    )
    comparison.to_csv(os.path.join(OUTPUT_DIR, "knn_hyperparameter_comparison.csv"), index=False)

    best_model = grid_search.best_estimator_
    y_pred, metrics, report, matrix = evaluate_model(best_model, X_test, y_test, label_names)

    metrics_df = pd.DataFrame([metrics])
    metrics_df.to_csv(os.path.join(OUTPUT_DIR, "knn_test_metrics.csv"), index=False)

    class_report_df = pd.DataFrame(classification_report(y_test, y_pred, target_names=label_names, output_dict=True)).T
    class_report_df.to_csv(os.path.join(OUTPUT_DIR, "knn_classification_report.csv"))

    matrix_df = pd.DataFrame(matrix, index=label_names, columns=label_names)
    matrix_df.to_csv(os.path.join(OUTPUT_DIR, "knn_confusion_matrix.csv"))

    with open(os.path.join(OUTPUT_DIR, "best_knn_model.pkl"), "wb") as file:
        pickle.dump(best_model, file)

    with open(os.path.join(OUTPUT_DIR, "knn_summary.txt"), "w", encoding="utf-8") as file:
        file.write("Electronic Online Shop - KNN Classifier Summary\n")
        file.write("=" * 52 + "\n\n")
        file.write(f"Dataset shape: {df.shape}\n")
        file.write(f"Feature matrix shape: {X.shape}\n")
        file.write(f"Target classes: {', '.join(label_names)}\n")
        file.write(f"Numeric features scaled: {numeric_features}\n")
        file.write(f"Categorical features one hot encoded: {categorical_features}\n\n")
        file.write("Hyperparameter tuning:\n")
        file.write("- n_neighbors: [3, 5, 7, 9, 11, 15, 21]\n")
        file.write("- weights: ['uniform', 'distance']\n")
        file.write("- distance metrics: ['euclidean', 'manhattan', 'minkowski']\n")
        file.write("- scoring: weighted F1 score\n")
        file.write("- cross validation: 5 folds\n\n")
        file.write(f"Best parameters: {grid_search.best_params_}\n")
        file.write(f"Best CV weighted F1 score: {grid_search.best_score_:.4f}\n\n")
        file.write("Test metrics:\n")
        for metric_name, metric_value in metrics.items():
            file.write(f"- {metric_name}: {metric_value:.4f}\n")
        file.write("\nClassification report:\n")
        file.write(report + "\n")
        file.write("Confusion matrix:\n")
        file.write(str(matrix_df) + "\n")

    plt.figure(figsize=(8, 6))
    sns.heatmap(matrix_df, annot=True, fmt="d", cmap="Blues", linewidths=0.5)
    plt.title("KNN Confusion Matrix", fontsize=15, weight="bold")
    plt.xlabel("Predicted Demand Level")
    plt.ylabel("Actual Demand Level")
    save_plot("01_knn_confusion_matrix.png")

    top_results = comparison.head(12).copy()
    top_results["configuration"] = (
        "k="
        + top_results["n_neighbors"].astype(str)
        + ", "
        + top_results["weights"].astype(str)
        + ", "
        + top_results["metric"].astype(str)
    )
    plt.figure(figsize=(12, 7))
    sns.barplot(data=top_results, x="mean_cv_test_f1_weighted", y="configuration", hue="configuration", legend=False)
    plt.title("Top KNN Hyperparameter Results", fontsize=15, weight="bold")
    plt.xlabel("Mean CV Weighted F1 Score")
    plt.ylabel("Configuration")
    save_plot("02_knn_hyperparameter_comparison.png")

    metric_plot_df = pd.DataFrame(
        {
            "Metric": ["Accuracy", "Precision", "Recall", "F1 Score"],
            "Score": [
                metrics["accuracy"],
                metrics["precision_weighted"],
                metrics["recall_weighted"],
                metrics["f1_weighted"],
            ],
        }
    )
    plt.figure(figsize=(8, 5))
    sns.barplot(data=metric_plot_df, x="Metric", y="Score", hue="Metric", legend=False)
    plt.ylim(0, 1)
    plt.title("KNN Test Performance Metrics", fontsize=15, weight="bold")
    save_plot("03_knn_test_metrics.png")

    print("KNN classifier completed successfully.")
    print(f"Best parameters: {grid_search.best_params_}")
    print(f"Best CV weighted F1 score: {grid_search.best_score_:.4f}")
    print(f"Test accuracy: {metrics['accuracy']:.4f}")
    print(f"Test precision weighted: {metrics['precision_weighted']:.4f}")
    print(f"Test recall weighted: {metrics['recall_weighted']:.4f}")
    print(f"Test F1 weighted: {metrics['f1_weighted']:.4f}")
    print(f"Output folder: {os.path.abspath(OUTPUT_DIR)}")


if __name__ == "__main__":
    main()
