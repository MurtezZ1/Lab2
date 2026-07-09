# Machine Learning Documentation

## Dataset

- File: `data/sunspot_electronic_online_shop.csv`
- Rows: 2400
- Target: `DemandLevel`
- Classes: `Low`, `Medium`, `High`
- Origin: synthetic but realistic e-commerce dataset generated for academic ML experimentation

The dataset is not claimed to be a real company dataset. It is suitable for the course because it contains realistic electronic-shop variables such as product category, brand, price, rating, reviews, stock quantity, discount percentage, warranty months, sold units, and demand level.

## Preprocessing

The same preprocessing approach is used in the main pipeline and feature-selection script.

Numerical features:

- `SimpleImputer(strategy="median")`
- `StandardScaler()`

Categorical features:

- `SimpleImputer(strategy="most_frequent")`
- `OneHotEncoder(handle_unknown="ignore")`

Excluded leakage/identifier columns:

- `ProductID`
- `ProductName`
- `SoldUnits`

`SoldUnits` is excluded because it is too directly related to the target and could create target leakage.

## Classification Models

The supervised pipeline is implemented in:

`ml/sunspot_electronic_online_shop_pipeline.py`

Implemented classifiers:

- KNN
- Decision Tree
- Random Forest
- Logistic Regression
- SVM
- Neural Network `(50,)`
- Neural Network `(100,)`
- Neural Network `(100, 50)`
- Neural Network `(128, 64)`

## Model Selection Criterion

The main ranking metric is **Weighted F1 Score**.

Accuracy is still reported, but Weighted F1 is used for final model selection because `DemandLevel` is multiclass and imbalanced. Weighted F1 balances precision and recall while accounting for class support.

## Latest Classification Results

Output file:

`outputs/sunspot_electronic_online_shop/model_comparison.csv`

| Rank | Model | Accuracy | Precision | Recall | Weighted F1 |
|---:|---|---:|---:|---:|---:|
| 1 | Neural Network `(100,)` | 0.5792 | 0.5566 | 0.5792 | 0.4978 |
| 2 | Logistic Regression | 0.5708 | 0.5351 | 0.5708 | 0.4966 |
| 3 | SVM | 0.5042 | 0.4858 | 0.5042 | 0.4915 |
| 4 | Neural Network `(128, 64)` | 0.5479 | 0.5211 | 0.5479 | 0.4844 |
| 5 | Decision Tree | 0.5333 | 0.4681 | 0.5333 | 0.4701 |
| 6 | Neural Network `(100, 50)` | 0.5438 | 0.4865 | 0.5438 | 0.4658 |
| 7 | Random Forest | 0.5354 | 0.4613 | 0.5354 | 0.4542 |
| 8 | Neural Network `(50,)` | 0.5583 | 0.4978 | 0.5583 | 0.4337 |
| 9 | KNN | 0.4250 | 0.4188 | 0.4250 | 0.4210 |

Best model by Weighted F1:

`Neural Network (100,)`

## Hyperparameter Tuning

GridSearchCV is used with `f1_weighted` scoring.

Important tested values:

- KNN: `n_neighbors`, `weights`, `metric`
- Decision Tree: `criterion`, `max_depth`, `min_samples_split`
- Random Forest: `n_estimators`, `max_depth`, `min_samples_split`
- Logistic Regression: `C`, `solver`
- SVM: `C`, `kernel`, `gamma`
- MLPClassifier: `hidden_layer_sizes`, `activation`, `alpha`, `learning_rate_init`

Tuning summary:

`outputs/sunspot_electronic_online_shop/hyperparameter_tuning_summary.csv`

## Feature Selection

Feature selection is implemented in:

`ml/sunspot_electronic_online_shop_feature_selection.py`

Methods:

- SelectKBest
- Correlation Analysis
- Random Forest Feature Importance

Latest feature-selection result:

- Best selected feature set: Random Forest Importance
- Features used: 15
- Weighted F1: 0.4975
- Improvement over all features: +0.0172

Output folder:

`outputs/sunspot_electronic_online_shop/feature_selection/`

## Clustering

Clustering is implemented in:

`ml/sunspot_electronic_online_shop_pipeline.py`

Target label is removed before clustering.

Experiments:

- KMeans with K = 2, 3, 4, 5, 6
- KMeans init methods: `k-means++`, `random`
- KMeans `n_init`: 10, 20
- Agglomerative Clustering with linkages: `ward`, `complete`, `average`

Metrics:

- Silhouette Score
- Davies-Bouldin Score
- Calinski-Harabasz Score
- Cluster label distribution
- Crosstab with true `DemandLevel`

Latest best clustering experiment:

- Algorithm: Agglomerative Clustering
- K: 2
- Linkage: average
- Silhouette Score: 0.1637
- Cluster-label matching percentage: 56.25%

The clustering results show that natural feature-space groups only partially align with the supervised demand labels.

## Performance Discussion

The model performance is moderate because the demand classes overlap and the dataset does not include many real-world behavioral and time-series predictors. The synthetic nature of the dataset also limits separability. Better performance would likely require real transaction data, product views, cart additions, wishlist counts, seasonality, campaign information, and time-aware validation.

## Outputs

- Model comparison: `outputs/sunspot_electronic_online_shop/model_comparison.csv`
- Hyperparameter tuning summary: `outputs/sunspot_electronic_online_shop/hyperparameter_tuning_summary.csv`
- Neural network tuning results: `outputs/sunspot_electronic_online_shop/neural_network_gridsearch_results.csv`
- Clustering metrics: `outputs/sunspot_electronic_online_shop/cluster_metrics.csv`
- Feature selection comparison: `outputs/sunspot_electronic_online_shop/feature_selection/feature_selection_model_comparison.csv`
- Confusion matrices and figures: `outputs/sunspot_electronic_online_shop/figures/`
- Final ML report: `reports/sunspot_electronic_online_shop_final_report.md`
