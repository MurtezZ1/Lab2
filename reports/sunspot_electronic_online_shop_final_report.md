# Sunspot - Electronic Online Shop Machine Learning Analysis

**Application:** Sunspot  
**Project:** Electronic Online Shop Machine Learning  
**Target variable:** DemandLevel  

## Data Availability Note

The integrated project dataset is available at `data/sunspot_electronic_online_shop.csv`. The codebase is configured to run directly from the root project structure and stores outputs in `outputs/sunspot_electronic_online_shop/`.

## 1. Introduction

Electronic commerce platforms produce large quantities of transactional, behavioral, and product-related data. Machine learning can transform this data into practical predictions about demand level, helping online shops improve stock planning, marketing decisions, and customer experience. This project analyzes an Electronic Online Shop dataset and develops classification and clustering models focused on the target variable `DemandLevel`.

## 2. Problem Statement

The main supervised learning problem is to predict whether a product or online shop record belongs to a specific demand category. The project also uses unsupervised clustering to investigate whether natural customer or product groups align with the real `DemandLevel` labels.

## 3. Dataset Description

The expected dataset is a CSV file named `sunspot_electronic_online_shop.csv` inside the `data/` folder. The required target column is `DemandLevel`. Numerical columns are standardized, while categorical columns are encoded using one-hot encoding. The pipeline automatically detects feature types, making the solution flexible for different versions of the dataset.

## 4. Data Preprocessing

The preprocessing workflow includes missing-value review, separation of features and target, train-test split, standardization of numerical features, categorical encoding, and model pipeline construction. Stratified splitting is used to preserve the target-class distribution in training and testing sets.

## 5. Classification Models

The classification stage compares KNN, Decision Tree, Random Forest, Logistic Regression, SVM, Neural Network Architecture 1, and Neural Network Architecture 2. The comparison uses Accuracy, Precision, Recall, and F1 Score. Weighted averages are used because `DemandLevel` is a multiclass target and class distributions may be imbalanced.

| Model | Accuracy | Precision | Recall | F1 Score |
|---|---:|---:|---:|---:|
| Neural Network Architecture 2 | 0.5479 | 0.5158 | 0.5479 | 0.5070 |
| Logistic Regression | 0.5688 | 0.5320 | 0.5688 | 0.4995 |
| SVM | 0.5042 | 0.4858 | 0.5042 | 0.4915 |
| Decision Tree | 0.5333 | 0.4681 | 0.5333 | 0.4701 |
| Random Forest | 0.5354 | 0.4613 | 0.5354 | 0.4542 |
| KNN | 0.4563 | 0.4276 | 0.4563 | 0.4372 |
| Neural Network Architecture 1 | 0.5479 | 0.3990 | 0.5479 | 0.4173 |

## 6. Logistic Regression

Logistic Regression is implemented as a baseline linear classifier. It is trained inside a scikit-learn pipeline with preprocessing and GridSearchCV. The tuned hyperparameters include regularization strength `C` and solver selection. Logistic Regression is interpretable and often performs well when class separation is approximately linear after preprocessing.

## 7. Support Vector Machine

SVM is implemented as a margin-based classifier inside the same preprocessing pipeline as the other supervised models. GridSearchCV tunes `C`, `kernel`, and `gamma`. The best SVM configuration used `C=10.0`, `kernel=rbf`, and `gamma=scale`, producing a weighted F1 Score of 0.4915. This makes SVM the third-ranked classifier in the integrated comparison and gives the project a stronger nonlinear model family beyond trees and neural networks.

## 8. Neural Networks

Architecture 1 uses one hidden layer with 50 neurons, ReLU activation, and Adam optimization. This design is simple and helps establish whether a shallow neural network can capture useful nonlinear relationships.

Architecture 2 uses two hidden layers with 100 and 50 neurons. This deeper architecture can learn more complex feature interactions but also increases the risk of overfitting and longer training time.

## 9. Hyperparameter Tuning

GridSearchCV is used to tune hidden layer sizes, learning rate, activation function, alpha regularization, and batch size. The best configuration is selected using weighted F1 Score because it balances precision and recall across all demand classes.

| Hyperparameter | Values Tested |
|---|---|
| Hidden layers | (50), (100), (100, 50), (128, 64) |
| Activation | ReLU, Tanh |
| Learning rate | 0.001, 0.01 |
| Alpha | 0.0001, 0.001 |
| Batch size | 32, 64 |
| SVM C | 0.1, 1.0, 10.0 |
| SVM kernel | Linear, RBF |
| SVM gamma | Scale, Auto |

The best tuned neural network used Tanh activation, alpha 0.001, batch size 64, hidden layers `(100, 50)`, and learning rate 0.01. It achieved a weighted F1 Score of 0.4695 during the dedicated neural-network tuning workflow without using leakage-prone sales features.

## 10. Clustering

K-Means clustering is applied after removing `DemandLevel`. Numerical features are standardized and categorical features are one-hot encoded. The project tests K values from 2 to 6, visualizes clusters using PCA, and evaluates cluster quality with the elbow method and silhouette score.

| K | Inertia | Silhouette Score |
|---:|---:|---:|
| 2 | 16538.08 | 0.1328 |
| 3 | 15260.06 | 0.1128 |
| 4 | 14251.41 | 0.0991 |
| 5 | 13476.05 | 0.0944 |
| 6 | 12880.77 | 0.0927 |

The highest silhouette score was obtained with K=2. The cluster-label matching percentage was 56.17%, showing that the unsupervised clusters only partially align with the supervised `DemandLevel` classes.

## 11. Results

The final model ranking is produced in `outputs/sunspot_electronic_online_shop/model_comparison.csv`. Based on weighted F1 Score, Neural Network Architecture 2 ranked highest in the integrated pipeline. Logistic Regression achieved the highest raw accuracy, while SVM ranked third with the best tuned configuration `C=10.0`, `kernel=rbf`, and `gamma=scale`.

## 12. Discussion

Logistic Regression provides interpretability and a strong baseline. SVM adds a nonlinear margin-based approach and improves the model family diversity required for a complete classification study. Tree-based models can capture nonlinear thresholds and interactions. Neural networks can model more complex decision boundaries but may require more careful tuning. K-Means clustering evaluates whether the data contains natural groupings that correspond to real demand labels. If the matching percentage is high, the unsupervised clusters resemble the actual labels; if it is low, `DemandLevel` may depend on supervised signals not captured by simple distance-based clustering.

## 13. Conclusion

This project provides a complete machine learning workflow for Electronic Online Shop demand analysis. It includes data preprocessing, classification, SVM tuning, neural network design, hyperparameter tuning, clustering, cluster-label evaluation, and final model comparison. The recommended final model is Neural Network Architecture 2 based on weighted F1 Score, while Logistic Regression remains a strong interpretable baseline and SVM provides an additional tuned nonlinear classifier.

## 14. References

[1] F. Pedregosa et al., "Scikit-learn: Machine Learning in Python," Journal of Machine Learning Research, vol. 12, pp. 2825-2830, 2011.  
[2] L. Breiman, "Random Forests," Machine Learning, vol. 45, no. 1, pp. 5-32, 2001.  
[3] J. MacQueen, "Some Methods for Classification and Analysis of Multivariate Observations," Proceedings of the Fifth Berkeley Symposium on Mathematical Statistics and Probability, 1967.  
[4] P. J. Rousseeuw, "Silhouettes: A graphical aid to the interpretation and validation of cluster analysis," Journal of Computational and Applied Mathematics, vol. 20, pp. 53-65, 1987.  
[5] D. P. Kingma and J. Ba, "Adam: A Method for Stochastic Optimization," International Conference on Learning Representations, 2015.  
[6] W. McKinney, "Data Structures for Statistical Computing in Python," Proceedings of the 9th Python in Science Conference, 2010.
