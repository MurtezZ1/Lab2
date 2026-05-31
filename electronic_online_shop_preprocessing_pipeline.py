import os
import pickle

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, StandardScaler


DATASET_PATH = os.path.join("electronic_online_shop_output", "electronic_online_shop_cleaned.csv")
OUTPUT_DIR = os.path.join("electronic_online_shop_output", "ml_preprocessing")


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    df = pd.read_csv(DATASET_PATH)

    target_column = "DemandLevel"
    columns_to_drop = ["ProductID", "ProductName", target_column]

    X = df.drop(columns=columns_to_drop)
    y = df[target_column]

    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    label_mapping = {
        label: int(encoded_value)
        for label, encoded_value in zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_))
    }

    numeric_features = X.select_dtypes(include=["int64", "float64"]).columns.tolist()
    categorical_features = X.select_dtypes(include=["object", "string"]).columns.tolist()

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y_encoded,
        test_size=0.20,
        random_state=42,
        stratify=y_encoded,
    )

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

    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)

    encoded_categorical_names = (
        preprocessor.named_transformers_["categorical"]
        .named_steps["onehot"]
        .get_feature_names_out(categorical_features)
    )
    processed_feature_names = numeric_features + encoded_categorical_names.tolist()

    X_train_processed_df = pd.DataFrame(X_train_processed, columns=processed_feature_names)
    X_test_processed_df = pd.DataFrame(X_test_processed, columns=processed_feature_names)
    y_train_df = pd.DataFrame({"DemandLevelEncoded": y_train})
    y_test_df = pd.DataFrame({"DemandLevelEncoded": y_test})

    X_train_processed_df.to_csv(os.path.join(OUTPUT_DIR, "X_train_processed.csv"), index=False)
    X_test_processed_df.to_csv(os.path.join(OUTPUT_DIR, "X_test_processed.csv"), index=False)
    y_train_df.to_csv(os.path.join(OUTPUT_DIR, "y_train.csv"), index=False)
    y_test_df.to_csv(os.path.join(OUTPUT_DIR, "y_test.csv"), index=False)

    model_pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("classifier", LogisticRegression(max_iter=1000, random_state=42)),
        ]
    )
    model_pipeline.fit(X_train, y_train)
    y_pred = model_pipeline.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, target_names=label_encoder.classes_)
    matrix = confusion_matrix(y_test, y_pred)

    with open(os.path.join(OUTPUT_DIR, "model_pipeline.pkl"), "wb") as file:
        pickle.dump(model_pipeline, file)

    with open(os.path.join(OUTPUT_DIR, "label_encoder.pkl"), "wb") as file:
        pickle.dump(label_encoder, file)

    summary_path = os.path.join(OUTPUT_DIR, "preprocessing_summary.txt")
    with open(summary_path, "w", encoding="utf-8") as file:
        file.write("Electronic Online Shop - ML Preprocessing Summary\n")
        file.write("=" * 52 + "\n\n")
        file.write(f"Original dataset shape: {df.shape}\n")
        file.write(f"Feature matrix shape before preprocessing: {X.shape}\n")
        file.write(f"X_train shape: {X_train.shape}\n")
        file.write(f"X_test shape: {X_test.shape}\n")
        file.write(f"Processed X_train shape: {X_train_processed_df.shape}\n")
        file.write(f"Processed X_test shape: {X_test_processed_df.shape}\n\n")
        file.write(f"Label encoding mapping: {label_mapping}\n\n")
        file.write(f"Numeric features scaled: {numeric_features}\n")
        file.write(f"Categorical features one hot encoded: {categorical_features}\n\n")
        file.write(f"Baseline accuracy: {accuracy:.4f}\n\n")
        file.write("Classification report:\n")
        file.write(report + "\n")
        file.write("Confusion matrix:\n")
        file.write(str(matrix) + "\n")

    print("Preprocessing completed successfully.")
    print(f"Output folder: {os.path.abspath(OUTPUT_DIR)}")
    print(f"Label mapping: {label_mapping}")
    print(f"Processed X_train shape: {X_train_processed_df.shape}")
    print(f"Processed X_test shape: {X_test_processed_df.shape}")
    print(f"Baseline accuracy: {accuracy:.4f}")


if __name__ == "__main__":
    main()
