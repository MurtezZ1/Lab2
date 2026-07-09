# Sunspot - Electronic Online Shop Machine Learning Analysis

**Application:** Sunspot  
**Project:** Electronic Online Shop Machine Learning  
**Target variable:** `DemandLevel`  
**Dataset:** `data/sunspot_electronic_online_shop.csv`  

## 1. Introduction

Electronic commerce platforms use product, sales, pricing, review, stock, and customer-behavior signals to understand product demand. This project applies machine learning to classify electronic products into `Low`, `Medium`, and `High` demand levels and uses clustering to investigate whether natural groups in the data align with the supervised demand labels.

## 2. Dataset Origin and Limitations

The dataset used in this project is a **synthetic but realistic e-commerce dataset generated for academic ML experimentation**. It is not presented as a real company dataset.

This dataset is acceptable for the university ML task because it contains realistic Electronic Online Shop variables:

- Product identity and product name
- Category and brand
- Price
- Rating
- Number of reviews
- Stock quantity
- Discount percentage
- Warranty months
- Sold units
- Demand level

The dataset has 2400 rows and enough feature variety to support classification, preprocessing, feature selection, hyperparameter tuning, and clustering experiments.

Limitations:

- Synthetic data may not contain the same complexity as real transaction history.
- The `Low`, `Medium`, and `High` classes overlap, which reduces model separability.
- Demand labels may contain simplified or noisy patterns.
- The dataset does not include detailed time-series signals such as daily sales, seasonality, campaigns, product views, cart additions, and customer sessions.

Recommended real public dataset sources for future comparison include Kaggle e-commerce behavior datasets, UCI Online Retail datasets, or real store transaction exports if available.

## 3. Problem Statement

The supervised learning task is multiclass classification:

> Predict `DemandLevel` as `Low`, `Medium`, or `High`.

The unsupervised learning task is clustering:

> Remove the target label and test whether natural product groups correspond to the known demand classes.

## 4. Data Preprocessing

The preprocessing pipeline is consistent across the main classification pipeline, feature selection, and clustering.

Numerical features:

- `SimpleImputer(strategy="median")`
- `StandardScaler()`

Categorical features:

- `SimpleImputer(strategy="most_frequent")`
- `OneHotEncoder(handle_unknown="ignore")`

The following columns are excluded from model training:

- `ProductID`
- `ProductName`
- `SoldUnits`

`SoldUnits` is excluded because it is too directly related to `DemandLevel` and could create target leakage.

## 5. Model Selection Criterion

The ranking criterion is **Weighted F1 Score**.

Accuracy is reported, but it is not the primary model-selection metric because the target classes are imbalanced:

- `Medium`: 1348 records
- `Low`: 616 records
- `High`: 436 records

Weighted F1 is preferred because it balances precision and recall while accounting for the class distribution. A model can achieve high accuracy by predicting the majority class too often, but F1 better reflects performance across all demand classes.

## 6. Classification Models

The following classifiers are implemented in `ml/sunspot_electronic_online_shop_pipeline.py`:

- KNN
- Decision Tree
- Random Forest
- Logistic Regression
- SVM
- Neural Network `(50,)`
- Neural Network `(100,)`
- Neural Network `(100, 50)`
- Neural Network `(128, 64)`

## 7. Hyperparameter Tuning

GridSearchCV is used across classifiers. The scoring metric is `f1_weighted`.

Values tested:

| Model | Hyperparameters |
|---|---|
| KNN | `n_neighbors`: 5, 9, 15; `weights`: uniform, distance; `metric`: euclidean |
| Decision Tree | `criterion`: gini; `max_depth`: 4, 8, None; `min_samples_split`: 2, 10 |
| Random Forest | `n_estimators`: 100; `max_depth`: 8, None; `min_samples_split`: 2, 10 |
| Logistic Regression | `C`: 0.1, 1.0, 10.0; `solver`: lbfgs |
| SVM | `C`: 0.1, 1.0, 10.0; `kernel`: linear, rbf; `gamma`: scale, auto |
| Neural Network | `hidden_layer_sizes`: (50,), (100,), (100, 50), (128, 64); `activation`: relu, tanh; `alpha`: 0.0001, 0.001; `learning_rate_init`: 0.001, 0.01 |

## 8. Neural Network Architectures

Four architectures were tested and evaluated:

- `(50,)`: one hidden layer with 50 neurons
- `(100,)`: one hidden layer with 100 neurons
- `(100, 50)`: two hidden layers
- `(128, 64)`: larger two-layer architecture

The best neural-network result in the final test comparison was:

> **Neural Network `(100,)`**

This architecture performed best because it provided enough capacity to learn nonlinear patterns while remaining smaller and more stable than the deeper architectures on this dataset.

## 9. Classification Results

The final comparison table is saved at:

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

The best model by Weighted F1 is **Neural Network `(100,)`**. Logistic Regression is very close and remains the best simple interpretable baseline. SVM provides a strong nonlinear margin-based comparison.

## 10. Feature Selection

Feature selection is implemented in `ml/sunspot_electronic_online_shop_feature_selection.py`.

Methods used:

- SelectKBest with ANOVA F-score
- Correlation Analysis
- Random Forest Feature Importance

The feature selection results are saved in:

`outputs/sunspot_electronic_online_shop/feature_selection/`

Latest result:

| Feature Set | Features | Accuracy | Weighted F1 |
|---|---:|---:|---:|
| Random Forest Importance | 15 | 0.5146 | 0.4975 |
| All Features | 56 | 0.4958 | 0.4803 |
| Correlation Analysis | 15 | 0.4813 | 0.4723 |
| SelectKBest | 15 | 0.4771 | 0.4665 |

Random Forest feature importance produced the best selected feature subset and improved Weighted F1 by +0.0172 over using all features.

## 11. Clustering Experiments

Clustering is implemented in `ml/sunspot_electronic_online_shop_pipeline.py`.

The target label `DemandLevel` is removed before clustering.

KMeans experiments:

- K values: 2, 3, 4, 5, 6
- Initialization methods: `k-means++`, `random`
- `n_init`: 10, 20

Agglomerative Clustering experiments:

- K values: 2, 3, 4, 5, 6
- Linkage: `ward`, `complete`, `average`
- Metric: euclidean

Metrics:

- Silhouette Score
- Davies-Bouldin Score
- Calinski-Harabasz Score
- Cluster label distribution
- Crosstab against real `DemandLevel`

The clustering metrics are saved at:

`outputs/sunspot_electronic_online_shop/cluster_metrics.csv`

Best result by Silhouette Score:

- Algorithm: Agglomerative Clustering
- K: 2
- Linkage: average
- Silhouette Score: 0.1637
- Matching Percentage against labels: 56.25%

The best clustering result produced one very large cluster and one very small cluster. This is an important academic finding: the unsupervised distance structure does not map cleanly to the supervised `DemandLevel` classes. It supports the conclusion that demand labels require supervised signals and richer behavioral/time-based features.

## 12. Results Discussion

Model performance is moderate rather than high. This is expected and academically explainable.

Main reasons:

- The dataset is synthetic, so patterns are simplified and may not represent real customer behavior.
- The demand classes overlap, especially `Medium` with `Low` and `High`.
- `Medium` is the majority class, making the task imbalanced.
- Some useful real-world predictors are missing, such as page views, add-to-cart counts, conversion rate, marketing campaigns, seasonality, and date-based sales history.
- The classification target may contain label noise.
- Product demand is nonlinear and may depend on interactions not fully captured by the available features.
- `SoldUnits` was removed to prevent leakage, which makes the prediction task more realistic but harder.

The low-to-moderate Weighted F1 scores therefore do not mean the workflow is wrong. They show that the current feature set has limited separability for predicting `DemandLevel`.

## 13. Future Improvements

To improve performance in a real production setting:

- Use real transaction history.
- Add time-series sales features.
- Add seasonality and holiday indicators.
- Add product page views.
- Add cart additions and wishlist counts.
- Add customer behavior features.
- Add conversion-rate features.
- Collect more real data over time.
- Use XGBoost or LightGBM.
- Perform stronger feature engineering.
- Use time-aware validation instead of random train/test split.

## 14. Conclusion

The Machine Learning part now provides an honest, consistent, and academically correct workflow. It documents the dataset as synthetic but realistic, uses consistent preprocessing, tunes all major classifiers, evaluates four neural-network architectures, extends clustering beyond basic KMeans, and explains the moderate model performance with appropriate limitations and future improvements.

The final selected model is:

> **Neural Network `(100,)`, selected by Weighted F1 Score.**

## 15. References

[1] F. Pedregosa et al., "Scikit-learn: Machine Learning in Python," Journal of Machine Learning Research, vol. 12, pp. 2825-2830, 2011.  
[2] L. Breiman, "Random Forests," Machine Learning, vol. 45, no. 1, pp. 5-32, 2001.  
[3] J. MacQueen, "Some Methods for Classification and Analysis of Multivariate Observations," Proceedings of the Fifth Berkeley Symposium on Mathematical Statistics and Probability, 1967.  
[4] P. J. Rousseeuw, "Silhouettes: A graphical aid to the interpretation and validation of cluster analysis," Journal of Computational and Applied Mathematics, vol. 20, pp. 53-65, 1987.  
[5] D. P. Kingma and J. Ba, "Adam: A Method for Stochastic Optimization," International Conference on Learning Representations, 2015.  
[6] W. McKinney, "Data Structures for Statistical Computing in Python," Proceedings of the 9th Python in Science Conference, 2010.
