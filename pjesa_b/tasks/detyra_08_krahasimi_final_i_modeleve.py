"""
Task 8 - Final Model Comparison Table.

Models:
- KNN
- Decision Tree
- Random Forest
- Logistic Regression
- Neural Network Architecture 1
- Neural Network Architecture 2
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(PROJECT_ROOT))

from src.pipeline_dyqani_elektronik import classification_workflow, load_dataset


df = load_dataset()
results, _ = classification_workflow(df)

ranked = results.sort_values("Rank")
best_model = ranked.iloc[0]

print("\nTask 8: Final Model Ranking")
print(ranked[["Rank", "Model", "Accuracy", "Precision", "Recall", "F1 Score"]])

print(f"\nBest model: {best_model['Model']}")
print(f"Best weighted F1 Score: {best_model['F1 Score']:.4f}")
