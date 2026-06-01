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
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from sklearn.tree import DecisionTreeClassifier, plot_tree


DATASET_PATH = os.path.join("electronic_online_shop_output", "electronic_online_shop_cleaned.csv")
OUTPUT_DIR = os.path.join("electronic_online_shop_output", "decision_tree_classifier")


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


def get_processed_feature_names(preprocessor, numeric_features, categorical_features):
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

    preprocessor, numeric_features, categorical_features = build_preprocessor(X)

    tree_pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("classifier", DecisionTreeClassifier(random_state=42, class_weight="balanced")),
        ]
    )

    param_grid = {
        "classifier__max_depth": [3, 4, 5, 6, 8, 10, None],
        "classifier__min_samples_split": [2, 5, 10, 20],
        "classifier__min_samples_leaf": [1, 2, 5, 10],
    }

    grid_search = GridSearchCV(
        estimator=tree_pipeline,
        param_grid=param_grid,
        scoring="f1_weighted",
        cv=5,
        n_jobs=-1,
        return_train_score=True,
    )
    grid_search.fit(X_train, y_train)

    results = pd.DataFrame(grid_search.cv_results_)
    comparison = results[
        [
            "param_classifier__max_depth",
            "param_classifier__min_samples_split",
            "param_classifier__min_samples_leaf",
            "mean_train_score",
            "mean_test_score",
            "std_test_score",
            "rank_test_score",
        ]
    ].sort_values("rank_test_score")
    comparison = comparison.rename(
        columns={
            "param_classifier__max_depth": "max_depth",
            "param_classifier__min_samples_split": "min_samples_split",
            "param_classifier__min_samples_leaf": "min_samples_leaf",
            "mean_train_score": "mean_cv_train_f1_weighted",
            "mean_test_score": "mean_cv_test_f1_weighted",
            "std_test_score": "std_cv_test_f1_weighted",
            "rank_test_score": "rank",
        }
    )
    comparison.to_csv(os.path.join(OUTPUT_DIR, "decision_tree_hyperparameter_comparison.csv"), index=False)

    best_model = grid_search.best_estimator_
    y_pred, metrics, report, matrix = evaluate_model(best_model, X_test, y_test, label_names)

    pd.DataFrame([metrics]).to_csv(os.path.join(OUTPUT_DIR, "decision_tree_test_metrics.csv"), index=False)
    pd.DataFrame(classification_report(y_test, y_pred, target_names=label_names, output_dict=True)).T.to_csv(
        os.path.join(OUTPUT_DIR, "decision_tree_classification_report.csv")
    )

    matrix_df = pd.DataFrame(matrix, index=label_names, columns=label_names)
    matrix_df.to_csv(os.path.join(OUTPUT_DIR, "decision_tree_confusion_matrix.csv"))

    with open(os.path.join(OUTPUT_DIR, "best_decision_tree_model.pkl"), "wb") as file:
        pickle.dump(best_model, file)

    fitted_preprocessor = best_model.named_steps["preprocessor"]
    fitted_tree = best_model.named_steps["classifier"]
    feature_names = get_processed_feature_names(fitted_preprocessor, numeric_features, categorical_features)

    feature_importance = (
        pd.DataFrame(
            {
                "Feature": feature_names,
                "Importance": fitted_tree.feature_importances_,
            }
        )
        .sort_values("Importance", ascending=False)
        .reset_index(drop=True)
    )
    feature_importance.to_csv(os.path.join(OUTPUT_DIR, "decision_tree_feature_importance.csv"), index=False)

    plt.figure(figsize=(8, 6))
    sns.heatmap(matrix_df, annot=True, fmt="d", cmap="Greens", linewidths=0.5)
    plt.title("Decision Tree Confusion Matrix", fontsize=15, weight="bold")
    plt.xlabel("Predicted Demand Level")
    plt.ylabel("Actual Demand Level")
    save_plot("01_decision_tree_confusion_matrix.png")

    top_results = comparison.head(12).copy()
    top_results["max_depth"] = top_results["max_depth"].astype(str)
    top_results["configuration"] = (
        "depth="
        + top_results["max_depth"]
        + ", split="
        + top_results["min_samples_split"].astype(str)
        + ", leaf="
        + top_results["min_samples_leaf"].astype(str)
    )
    plt.figure(figsize=(12, 7))
    sns.barplot(data=top_results, x="mean_cv_test_f1_weighted", y="configuration", hue="configuration", legend=False)
    plt.title("Top Decision Tree Hyperparameter Results", fontsize=15, weight="bold")
    plt.xlabel("Mean CV Weighted F1 Score")
    plt.ylabel("Configuration")
    save_plot("02_decision_tree_hyperparameter_comparison.png")

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
    plt.title("Decision Tree Test Performance Metrics", fontsize=15, weight="bold")
    save_plot("03_decision_tree_test_metrics.png")

    top_features = feature_importance.head(15)
    plt.figure(figsize=(12, 7))
    sns.barplot(data=top_features, x="Importance", y="Feature", hue="Feature", legend=False)
    plt.title("Top 15 Decision Tree Feature Importances", fontsize=15, weight="bold")
    plt.xlabel("Importance")
    plt.ylabel("Feature")
    save_plot("04_decision_tree_feature_importance.png")

    plt.figure(figsize=(28, 14))
    plot_tree(
        fitted_tree,
        feature_names=feature_names,
        class_names=label_names,
        filled=True,
        rounded=True,
        max_depth=3,
        fontsize=8,
    )
    plt.title("Decision Tree Visualization - First 3 Levels", fontsize=18, weight="bold")
    save_plot("05_decision_tree_visualization.png")

    top_feature_text = feature_importance.head(10).to_string(index=False)
    summary_path = os.path.join(OUTPUT_DIR, "decision_tree_summary.txt")
    with open(summary_path, "w", encoding="utf-8") as file:
        file.write("Electronic Online Shop - Decision Tree Classifier Summary\n")
        file.write("=" * 60 + "\n\n")
        file.write(f"Dataset shape: {df.shape}\n")
        file.write(f"Feature matrix shape: {X.shape}\n")
        file.write(f"Target classes: {', '.join(label_names)}\n")
        file.write(f"Excluded leakage columns: {leakage_columns}\n")
        file.write(f"Numeric features: {numeric_features}\n")
        file.write(f"Categorical features one hot encoded: {categorical_features}\n\n")
        file.write("Hyperparameter tuning:\n")
        file.write("- max_depth: [3, 4, 5, 6, 8, 10, None]\n")
        file.write("- min_samples_split: [2, 5, 10, 20]\n")
        file.write("- min_samples_leaf: [1, 2, 5, 10]\n")
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
        file.write(str(matrix_df) + "\n\n")
        file.write("Feature importance explanation:\n")
        file.write(
            "Feature importance shows which columns the tree used most often to split the data and reduce impurity. "
            "Higher values indicate stronger influence on DemandLevel predictions.\n\n"
        )
        file.write(
            "SoldUnits was excluded from the feature set because DemandLevel was generated from demand/sales behavior. "
            "Keeping SoldUnits would make the model unrealistically accurate and would leak information from the target.\n\n"
        )
        file.write("Top 10 important features:\n")
        file.write(top_feature_text + "\n")

    print("Decision Tree classifier completed successfully.")
    print(f"Best parameters: {grid_search.best_params_}")
    print(f"Best CV weighted F1 score: {grid_search.best_score_:.4f}")
    print(f"Test accuracy: {metrics['accuracy']:.4f}")
    print(f"Test precision weighted: {metrics['precision_weighted']:.4f}")
    print(f"Test recall weighted: {metrics['recall_weighted']:.4f}")
    print(f"Test F1 weighted: {metrics['f1_weighted']:.4f}")
    print(f"Most important feature: {feature_importance.iloc[0]['Feature']}")
    print(f"Output folder: {os.path.abspath(OUTPUT_DIR)}")


if __name__ == "__main__":
    main()
