# Machine Learning Documentation

## Dataset

- File: `data/sunspot_electronic_online_shop.csv`
- Rows: 2400
- Target: `DemandLevel`
- Classes: `Low`, `Medium`, `High`

## Classification Models

The supervised pipeline is implemented in `ml/sunspot_electronic_online_shop_pipeline.py`.

Implemented classifiers:

- KNN
- Decision Tree
- Random Forest
- Logistic Regression
- SVM
- Neural Network Architecture 1
- Neural Network Architecture 2

## SVM Implementation

SVM is trained with the same preprocessing pipeline used by the other models.

Tuned hyperparameters:

- `C`: 0.1, 1.0, 10.0
- `kernel`: linear, rbf
- `gamma`: scale, auto

Latest best parameters:

- `C=10.0`
- `kernel=rbf`
- `gamma=scale`

Latest SVM metrics:

- Accuracy: 0.5042
- Precision: 0.4858
- Recall: 0.5042
- F1 Score: 0.4915

## Outputs

- Model comparison: `outputs/sunspot_electronic_online_shop/model_comparison.csv`
- SVM confusion matrix: `outputs/sunspot_electronic_online_shop/figures/svm_confusion_matrix.png`
- Final model comparison chart: `outputs/sunspot_electronic_online_shop/figures/final_model_comparison.png`
- Final report: `reports/sunspot_electronic_online_shop_final_report.md`

