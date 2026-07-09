"""
Sunspot Electronic Online Shop Machine Learning Pipeline

This module covers the integrated Sunspot ML responsibilities:
- Logistic Regression for DemandLevel prediction
- SVM for DemandLevel prediction
- Neural Network architecture tuning with MLPClassifier
- K-Means clustering with multiple K/init/n_init experiments
- Agglomerative clustering with multiple linkage experiments
- Cluster evaluation against real DemandLevel labels
- Final comparison table for KNN, Decision Tree, Random Forest,
  Logistic Regression, SVM, and two Neural Network architectures

Dataset path:
    data/sunspot_electronic_online_shop.csv

Required target column:
    DemandLevel
"""

from __future__ import annotations

import time
import warnings
from pathlib import Path
from typing import Dict, Iterable, List, Tuple

import numpy as np
import pandas as pd

import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.cluster import AgglomerativeClustering, KMeans
from sklearn.compose import ColumnTransformer
from sklearn.decomposition import PCA
from sklearn.ensemble import RandomForestClassifier
from sklearn.exceptions import ConvergenceWarning
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    calinski_harabasz_score,
    classification_report,
    confusion_matrix,
    davies_bouldin_score,
    f1_score,
    precision_score,
    recall_score,
    silhouette_score,
)
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, StandardScaler
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier


warnings.filterwarnings("ignore", category=ConvergenceWarning)

RANDOM_STATE = 42
TARGET_COLUMN = "DemandLevel"
DATA_PATH = Path("data/sunspot_electronic_online_shop.csv")
OUTPUT_DIR = Path("outputs/sunspot_electronic_online_shop")
FIGURE_DIR = OUTPUT_DIR / "figures"
TUNING_SAMPLE_SIZE = 700
EXCLUDED_FEATURE_COLUMNS = ["ProductID", "ProductName", "SoldUnits"]
NN_ARCHITECTURES = [(50,), (100,), (100, 50), (128, 64)]


def make_one_hot_encoder() -> OneHotEncoder:
    """Return an encoder compatible with both older and newer scikit-learn versions."""
    try:
        return OneHotEncoder(handle_unknown="ignore", sparse_output=False)
    except TypeError:
        return OneHotEncoder(handle_unknown="ignore", sparse=False)


def load_dataset(path: Path = DATA_PATH, target_column: str = TARGET_COLUMN) -> pd.DataFrame:
    """Load the synthetic but realistic Electronic Online Shop dataset."""
    if not path.exists():
        raise FileNotFoundError(
            f"Dataset was not found at {path}. The ML pipeline requires the project dataset."
        )
    df = pd.read_csv(path)
    print(f"Loaded synthetic but realistic academic dataset from {path.resolve()}")

    if target_column not in df.columns:
        raise ValueError(
            f"Target column '{target_column}' was not found. "
            f"Available columns: {list(df.columns)}"
        )
    return df


def split_columns(df: pd.DataFrame, target_column: str = TARGET_COLUMN) -> Tuple[pd.DataFrame, pd.Series, List[str], List[str]]:
    """Separate X/y and detect numerical and categorical feature columns."""
    columns_to_drop = [target_column] + [column for column in EXCLUDED_FEATURE_COLUMNS if column in df.columns]
    X = df.drop(columns=columns_to_drop)
    y = df[target_column].astype(str)

    numeric_features = X.select_dtypes(include=["number", "bool"]).columns.tolist()
    categorical_features = X.select_dtypes(exclude=["number", "bool"]).columns.tolist()
    return X, y, numeric_features, categorical_features


def build_preprocessor(numeric_features: Iterable[str], categorical_features: Iterable[str]) -> ColumnTransformer:
    """Create preprocessing for numerical and categorical variables."""
    numeric_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )
    categorical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", make_one_hot_encoder()),
        ]
    )
    return ColumnTransformer(
        transformers=[
            ("numeric", numeric_pipeline, list(numeric_features)),
            ("categorical", categorical_pipeline, list(categorical_features)),
        ],
        remainder="drop",
    )


def metric_dict(name: str, y_true: pd.Series, y_pred: np.ndarray, training_time: float | None = None) -> Dict[str, float | str]:
    """Return weighted classification metrics for multiclass DemandLevel prediction."""
    row: Dict[str, float | str] = {
        "Model": name,
        "Accuracy": accuracy_score(y_true, y_pred),
        "Precision": precision_score(y_true, y_pred, average="weighted", zero_division=0),
        "Recall": recall_score(y_true, y_pred, average="weighted", zero_division=0),
        "F1 Score": f1_score(y_true, y_pred, average="weighted", zero_division=0),
    }
    if training_time is not None:
        row["Training Time (s)"] = training_time
    return row


def encode_target(y: pd.Series) -> Tuple[np.ndarray, LabelEncoder, List[str]]:
    """Encode DemandLevel labels for estimators that require numeric targets."""
    encoder = LabelEncoder()
    y_encoded = encoder.fit_transform(y.astype(str))
    labels = encoder.classes_.tolist()
    return y_encoded, encoder, labels


def save_confusion_matrix(
    y_true: pd.Series,
    y_pred: np.ndarray,
    model_name: str,
    labels: Iterable[str],
    output_dir: Path = FIGURE_DIR,
) -> None:
    """Save a confusion matrix heatmap for a trained model."""
    output_dir.mkdir(parents=True, exist_ok=True)
    cm = confusion_matrix(y_true, y_pred, labels=list(labels))
    safe_model_name = model_name.lower().replace(" ", "_").replace("-", "_").replace("(", "").replace(")", "").replace(",", "")
    pd.DataFrame(cm, index=list(labels), columns=list(labels)).to_csv(
        OUTPUT_DIR / f"{safe_model_name}_confusion_matrix.csv"
    )
    plt.figure(figsize=(7, 5))
    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=list(labels),
        yticklabels=list(labels),
    )
    plt.title(f"{model_name} Confusion Matrix")
    plt.xlabel("Predicted DemandLevel")
    plt.ylabel("Actual DemandLevel")
    plt.tight_layout()
    file_name = safe_model_name + "_confusion_matrix.png"
    plt.savefig(output_dir / file_name, dpi=180)
    plt.close()


def train_grid_model(
    name: str,
    estimator: Pipeline,
    param_grid: Dict[str, list],
    X_train: pd.DataFrame,
    y_train: pd.Series,
    cv: int = 5,
) -> Tuple[Pipeline, GridSearchCV, float]:
    """Train a GridSearchCV model and return the best estimator and elapsed time."""
    if len(X_train) > TUNING_SAMPLE_SIZE:
        X_tuning, _, y_tuning, _ = train_test_split(
            X_train,
            y_train,
            train_size=TUNING_SAMPLE_SIZE,
            random_state=RANDOM_STATE,
            stratify=y_train,
        )
    else:
        X_tuning, y_tuning = X_train, y_train

    grid = GridSearchCV(
        estimator=estimator,
        param_grid=param_grid,
        scoring="f1_weighted",
        cv=min(cv, 3),
        n_jobs=1,
        refit=True,
    )
    start = time.perf_counter()
    grid.fit(X_tuning, y_tuning)
    grid.best_estimator_.fit(X_train, y_train)
    elapsed = time.perf_counter() - start
    print(f"{name} best parameters: {grid.best_params_}")
    return grid.best_estimator_, grid, elapsed


def classification_workflow(df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, GridSearchCV]]:
    """Run all supervised classification tasks and save comparison outputs."""
    OUTPUT_DIR.mkdir(exist_ok=True)
    FIGURE_DIR.mkdir(parents=True, exist_ok=True)

    X, y, numeric_features, categorical_features = split_columns(df)
    y_encoded, target_encoder, labels = encode_target(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y_encoded,
        test_size=0.20,
        random_state=RANDOM_STATE,
        stratify=y_encoded,
    )

    def pipeline_for(model):
        return Pipeline(
            steps=[
                ("preprocessor", build_preprocessor(numeric_features, categorical_features)),
                ("model", model),
            ]
        )

    model_specs = {
        "KNN": (
            pipeline_for(KNeighborsClassifier()),
            {
                "model__n_neighbors": [5, 9, 15],
                "model__weights": ["uniform", "distance"],
                "model__metric": ["euclidean"],
            },
        ),
        "Decision Tree": (
            pipeline_for(DecisionTreeClassifier(random_state=RANDOM_STATE)),
            {
                "model__criterion": ["gini"],
                "model__max_depth": [4, 8, None],
                "model__min_samples_split": [2, 10],
            },
        ),
        "Random Forest": (
            pipeline_for(RandomForestClassifier(random_state=RANDOM_STATE)),
            {
                "model__n_estimators": [100],
                "model__max_depth": [8, None],
                "model__min_samples_split": [2, 10],
            },
        ),
        "Logistic Regression": (
            pipeline_for(LogisticRegression(max_iter=2000, random_state=RANDOM_STATE)),
            {
                "model__C": [0.1, 1.0, 10.0],
                "model__solver": ["lbfgs"],
            },
        ),
        "SVM": (
            pipeline_for(SVC(random_state=RANDOM_STATE)),
            {
                "model__C": [0.1, 1.0, 10.0],
                "model__kernel": ["linear", "rbf"],
                "model__gamma": ["scale", "auto"],
            },
        ),
    }

    for architecture in NN_ARCHITECTURES:
        model_specs[f"Neural Network {architecture}"] = (
            pipeline_for(
                MLPClassifier(
                    solver="adam",
                    early_stopping=True,
                    max_iter=500,
                    random_state=RANDOM_STATE,
                )
            ),
            {
                "model__hidden_layer_sizes": [architecture],
                "model__activation": ["relu", "tanh"],
                "model__alpha": [0.0001, 0.001],
                "model__learning_rate_init": [0.001, 0.01],
            },
        )

    results = []
    fitted_grids: Dict[str, GridSearchCV] = {}
    classification_reports = []

    for name, (pipeline, params) in model_specs.items():
        start = time.perf_counter()
        if params:
            cv = 2 if name.startswith("Neural Network") else 5
            model, grid, elapsed = train_grid_model(name, pipeline, params, X_train, y_train, cv=cv)
            fitted_grids[name] = grid
        else:
            model = pipeline
            model.fit(X_train, y_train)
            elapsed = time.perf_counter() - start

        predictions = model.predict(X_test)
        y_test_labels = target_encoder.inverse_transform(y_test)
        prediction_labels = target_encoder.inverse_transform(predictions)
        results.append(metric_dict(name, y_test_labels, prediction_labels, elapsed))
        save_confusion_matrix(y_test_labels, prediction_labels, name, labels)

        report = classification_report(y_test_labels, prediction_labels, zero_division=0)
        classification_reports.append(f"\n{name}\n{'=' * len(name)}\n{report}")
        print(f"\n{name} classification report")
        print(report)

    metrics_df = pd.DataFrame(results).sort_values("F1 Score", ascending=False)
    metrics_df["Rank"] = range(1, len(metrics_df) + 1)
    metrics_df.to_csv(OUTPUT_DIR / "model_comparison.csv", index=False)
    (OUTPUT_DIR / "classification_reports.txt").write_text(
        "Electronic Online Shop DemandLevel Classification Reports\n"
        "Model selection criterion: Weighted F1 Score\n"
        + "\n".join(classification_reports),
        encoding="utf-8",
    )

    plt.figure(figsize=(10, 6))
    metrics_long = metrics_df.melt(
        id_vars=["Model"],
        value_vars=["Accuracy", "Precision", "Recall", "F1 Score"],
        var_name="Metric",
        value_name="Score",
    )
    sns.barplot(data=metrics_long, x="Score", y="Model", hue="Metric")
    plt.title("Final Classification Model Comparison")
    plt.xlim(0, 1)
    plt.xlabel("Weighted Score")
    plt.ylabel("")
    plt.tight_layout()
    plt.savefig(FIGURE_DIR / "final_model_comparison.png", dpi=200)
    plt.close()

    tuning_rows = []
    for model_name, grid in fitted_grids.items():
        row = {"Model": model_name, "Best CV F1 Weighted": grid.best_score_}
        row.update(grid.best_params_)
        tuning_rows.append(row)
    pd.DataFrame(tuning_rows).to_csv(OUTPUT_DIR / "hyperparameter_tuning_summary.csv", index=False)

    return metrics_df, fitted_grids


def neural_network_grid_search(df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, object]]:
    """Tune the neural network with GridSearchCV and save summary tables."""
    X, y, numeric_features, categorical_features = split_columns(df)
    y_encoded, target_encoder, _ = encode_target(y)
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y_encoded,
        test_size=0.20,
        random_state=RANDOM_STATE,
        stratify=y_encoded,
    )

    pipeline = Pipeline(
        steps=[
            ("preprocessor", build_preprocessor(numeric_features, categorical_features)),
            (
                "model",
                MLPClassifier(
                    solver="adam",
                    early_stopping=True,
                    max_iter=350,
                    random_state=RANDOM_STATE,
                ),
            ),
        ]
    )

    param_grid = {
        "model__hidden_layer_sizes": NN_ARCHITECTURES,
        "model__activation": ["relu", "tanh"],
        "model__learning_rate_init": [0.001, 0.01],
        "model__alpha": [0.0001, 0.001],
    }

    if len(X_train) > 800:
        X_tuning, _, y_tuning, _ = train_test_split(
            X_train,
            y_train,
            train_size=800,
            random_state=RANDOM_STATE,
            stratify=y_train,
        )
    else:
        X_tuning, y_tuning = X_train, y_train

    grid = GridSearchCV(
        estimator=pipeline,
        param_grid=param_grid,
        scoring="f1_weighted",
        cv=2,
        n_jobs=1,
        refit=True,
    )

    start = time.perf_counter()
    grid.fit(X_tuning, y_tuning)
    grid.best_estimator_.fit(X_train, y_train)
    elapsed = time.perf_counter() - start

    predictions = grid.best_estimator_.predict(X_test)
    y_test_labels = target_encoder.inverse_transform(y_test)
    prediction_labels = target_encoder.inverse_transform(predictions)
    best_summary = metric_dict("Best Tuned Neural Network", y_test_labels, prediction_labels, elapsed)
    best_summary.update(grid.best_params_)

    cv_results = pd.DataFrame(grid.cv_results_).sort_values("rank_test_score")
    cv_results.to_csv(OUTPUT_DIR / "neural_network_gridsearch_results.csv", index=False)
    pd.DataFrame([best_summary]).to_csv(OUTPUT_DIR / "best_neural_network_configuration.csv", index=False)

    top = cv_results.head(10).copy()
    top["Configuration"] = top["params"].astype(str).str.slice(0, 80)
    plt.figure(figsize=(10, 6))
    sns.barplot(data=top, x="mean_test_score", y="Configuration", color="#2E74B5")
    plt.title("Top Neural Network GridSearchCV Configurations")
    plt.xlabel("Mean CV F1 Weighted")
    plt.ylabel("")
    plt.tight_layout()
    plt.savefig(FIGURE_DIR / "neural_network_gridsearch_top10.png", dpi=200)
    plt.close()

    return cv_results, best_summary


def prepare_clustering_matrix(df: pd.DataFrame) -> Tuple[np.ndarray, pd.Series]:
    """Preprocess features for clustering by removing DemandLevel and standardizing features."""
    X, y, numeric_features, categorical_features = split_columns(df)
    preprocessor = build_preprocessor(numeric_features, categorical_features)
    X_prepared = preprocessor.fit_transform(X)
    if hasattr(X_prepared, "toarray"):
        X_prepared = X_prepared.toarray()
    return X_prepared, y


def clustering_workflow(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame, float]:
    """Run K-Means and Agglomerative clustering experiments with multiple metrics."""
    OUTPUT_DIR.mkdir(exist_ok=True)
    FIGURE_DIR.mkdir(parents=True, exist_ok=True)

    X_prepared, y = prepare_clustering_matrix(df)
    pca = PCA(n_components=2, random_state=RANDOM_STATE)
    pca_points = pca.fit_transform(X_prepared)

    cluster_rows = []
    best_labels = None
    best_name = ""
    best_k = None
    best_silhouette = -1.0

    for k in range(2, 7):
        for init in ["k-means++", "random"]:
            for n_init in [10, 20]:
                kmeans = KMeans(n_clusters=k, init=init, random_state=RANDOM_STATE, n_init=n_init)
                labels = kmeans.fit_predict(X_prepared)
                silhouette = silhouette_score(X_prepared, labels)
                davies_bouldin = davies_bouldin_score(X_prepared, labels)
                calinski_harabasz = calinski_harabasz_score(X_prepared, labels)
                cluster_rows.append(
                    {
                        "Algorithm": "KMeans",
                        "K": k,
                        "Init": init,
                        "NInit": n_init,
                        "Linkage": "",
                        "Metric": "euclidean",
                        "Inertia": kmeans.inertia_,
                        "Silhouette Score": silhouette,
                        "Davies-Bouldin Score": davies_bouldin,
                        "Calinski-Harabasz Score": calinski_harabasz,
                        "Cluster Distribution": dict(pd.Series(labels).value_counts().sort_index()),
                    }
                )
                if silhouette > best_silhouette:
                    best_silhouette = silhouette
                    best_labels = labels
                    best_name = f"KMeans_k{k}_{init}_n{n_init}"
                    best_k = k

        kmeans = KMeans(n_clusters=k, init="k-means++", random_state=RANDOM_STATE, n_init=20)
        labels = kmeans.fit_predict(X_prepared)
        plot_df = pd.DataFrame({"PC1": pca_points[:, 0], "PC2": pca_points[:, 1], "Cluster": labels})
        plt.figure(figsize=(8, 6))
        sns.scatterplot(data=plot_df, x="PC1", y="PC2", hue="Cluster", palette="tab10", s=45)
        plt.title(f"K-Means PCA Visualization (K={k})")
        plt.tight_layout()
        plt.savefig(FIGURE_DIR / f"kmeans_pca_k{k}.png", dpi=180)
        plt.close()

        plt.figure(figsize=(7, 4))
        sns.countplot(x=labels, color="#2E74B5")
        plt.title(f"Cluster Distribution (K={k})")
        plt.xlabel("Cluster")
        plt.ylabel("Number of Records")
        plt.tight_layout()
        plt.savefig(FIGURE_DIR / f"cluster_distribution_k{k}.png", dpi=180)
        plt.close()

    for k in range(2, 7):
        for linkage in ["ward", "complete", "average"]:
            metric = "euclidean"
            model = AgglomerativeClustering(n_clusters=k, linkage=linkage, metric=metric)
            labels = model.fit_predict(X_prepared)
            silhouette = silhouette_score(X_prepared, labels)
            davies_bouldin = davies_bouldin_score(X_prepared, labels)
            calinski_harabasz = calinski_harabasz_score(X_prepared, labels)
            cluster_rows.append(
                {
                    "Algorithm": "Agglomerative",
                    "K": k,
                    "Init": "",
                    "NInit": "",
                    "Linkage": linkage,
                    "Metric": metric,
                    "Inertia": np.nan,
                    "Silhouette Score": silhouette,
                    "Davies-Bouldin Score": davies_bouldin,
                    "Calinski-Harabasz Score": calinski_harabasz,
                    "Cluster Distribution": dict(pd.Series(labels).value_counts().sort_index()),
                }
            )
            if silhouette > best_silhouette:
                best_silhouette = silhouette
                best_labels = labels
                best_name = f"Agglomerative_k{k}_{linkage}"
                best_k = k

    representative_agglomerative = AgglomerativeClustering(n_clusters=3, linkage="ward", metric="euclidean")
    representative_labels = representative_agglomerative.fit_predict(X_prepared)
    plot_df = pd.DataFrame({"PC1": pca_points[:, 0], "PC2": pca_points[:, 1], "Cluster": representative_labels})
    plt.figure(figsize=(8, 6))
    sns.scatterplot(data=plot_df, x="PC1", y="PC2", hue="Cluster", palette="tab10", s=45)
    plt.title("Agglomerative PCA Visualization (K=3, ward)")
    plt.tight_layout()
    plt.savefig(FIGURE_DIR / "agglomerative_pca_k3_ward.png", dpi=180)
    plt.close()

    cluster_metrics = pd.DataFrame(cluster_rows)
    cluster_metrics.to_csv(OUTPUT_DIR / "cluster_metrics.csv", index=False)

    kmeans_elbow = cluster_metrics[
        (cluster_metrics["Algorithm"] == "KMeans")
        & (cluster_metrics["Init"] == "k-means++")
        & (cluster_metrics["NInit"].astype(str) == "20")
    ].copy()
    plt.figure(figsize=(8, 5))
    sns.lineplot(data=kmeans_elbow, x="K", y="Inertia", marker="o")
    plt.title("Elbow Method for K-Means")
    plt.xlabel("Number of Clusters (K)")
    plt.ylabel("Inertia")
    plt.tight_layout()
    plt.savefig(FIGURE_DIR / "elbow_curve.png", dpi=200)
    plt.close()

    plt.figure(figsize=(8, 5))
    sns.lineplot(data=cluster_metrics, x="K", y="Silhouette Score", hue="Algorithm", marker="o")
    plt.title("Silhouette Score by Clustering Experiment")
    plt.xlabel("Number of Clusters (K)")
    plt.ylabel("Silhouette Score")
    plt.tight_layout()
    plt.savefig(FIGURE_DIR / "silhouette_scores.png", dpi=200)
    plt.close()

    plt.figure(figsize=(10, 6))
    top_cluster_metrics = cluster_metrics.sort_values("Silhouette Score", ascending=False).head(12).copy()
    top_cluster_metrics["Experiment"] = top_cluster_metrics.apply(
        lambda row: f"{row['Algorithm']} K={row['K']} {row['Init'] or row['Linkage']}", axis=1
    )
    sns.barplot(data=top_cluster_metrics, x="Silhouette Score", y="Experiment", color="#2E74B5")
    plt.title("Top Clustering Experiments by Silhouette Score")
    plt.tight_layout()
    plt.savefig(FIGURE_DIR / "clustering_metrics_comparison.png", dpi=200)
    plt.close()

    if best_labels is None:
        raise RuntimeError("No clustering labels were generated.")
    selected_labels = best_labels

    crosstab = pd.crosstab(
        pd.Series(selected_labels, name="Cluster"),
        pd.Series(y, name=TARGET_COLUMN),
    )
    crosstab.to_csv(OUTPUT_DIR / "cluster_label_crosstab.csv")

    matching_percentage = crosstab.max(axis=1).sum() / len(y) * 100

    plt.figure(figsize=(8, 5))
    sns.heatmap(crosstab, annot=True, fmt="d", cmap="Blues")
    plt.title(f"Cluster vs DemandLevel Crosstab ({best_name})")
    plt.xlabel("Actual DemandLevel")
    plt.ylabel("K-Means Cluster")
    plt.tight_layout()
    plt.savefig(FIGURE_DIR / "cluster_label_heatmap.png", dpi=200)
    plt.close()

    summary = pd.DataFrame(
        [
            {
                "Optimal K": best_k,
                "Best Experiment": best_name,
                "Best Silhouette Score": best_silhouette,
                "Matching Percentage": matching_percentage,
                "Selection Rule": "Highest silhouette score, checked with Davies-Bouldin and Calinski-Harabasz",
            }
        ]
    )
    summary.to_csv(OUTPUT_DIR / "cluster_label_matching_summary.csv", index=False)

    return cluster_metrics, crosstab, matching_percentage


def main() -> None:
    """Run all project tasks end to end."""
    df = load_dataset()
    print("\nDataset shape:", df.shape)
    print("\nDemandLevel distribution:")
    print(df[TARGET_COLUMN].value_counts())

    print("\nRunning classification workflow...")
    metrics_df, _ = classification_workflow(df)
    print("\nFinal model comparison:")
    print(metrics_df)

    print("\nRunning neural network hyperparameter tuning...")
    _, best_nn = neural_network_grid_search(df)
    print("\nBest neural network configuration:")
    print(best_nn)

    print("\nRunning clustering workflow...")
    cluster_metrics, crosstab, matching_percentage = clustering_workflow(df)
    print("\nCluster metrics:")
    print(cluster_metrics)
    print("\nCluster-label crosstab:")
    print(crosstab)
    print(f"\nCluster-label matching percentage: {matching_percentage:.2f}%")


if __name__ == "__main__":
    main()
