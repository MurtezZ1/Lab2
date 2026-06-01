"""
Task 1 - Logistic Regression for DemandLevel prediction.

Run from the project root after installing requirements:
    python tasks/task_01_logistic_regression.py
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(PROJECT_ROOT))

from src.pipeline_dyqani_elektronik import classification_workflow, load_dataset


df = load_dataset()
results, grids = classification_workflow(df)

comparison = results[
    results["Model"].isin(["KNN", "Decision Tree", "Logistic Regression"])
].sort_values("F1 Score", ascending=False)

print("\nTask 1: Logistic Regression compared with KNN and Decision Tree")
print(comparison[["Model", "Accuracy", "Precision", "Recall", "F1 Score"]])

if "Logistic Regression" in grids:
    print("\nBest Logistic Regression parameters:")
    print(grids["Logistic Regression"].best_params_)
