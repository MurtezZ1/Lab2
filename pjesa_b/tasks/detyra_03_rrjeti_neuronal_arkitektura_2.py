"""
Task 3 - Neural Network Architecture 2 using MLPClassifier.

Architecture:
- Input layer from preprocessed features
- Hidden layer 1 with 100 neurons
- Hidden layer 2 with 50 neurons
- Output layer for DemandLevel classes
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(PROJECT_ROOT))

from src.pipeline_dyqani_elektronik import classification_workflow, load_dataset


df = load_dataset()
results, _ = classification_workflow(df)

nn_results = results[
    results["Model"].isin(["Neural Network Architecture 1", "Neural Network Architecture 2"])
].sort_values("F1 Score", ascending=False)

print("\nTask 3: Architecture 2 Compared Against Architecture 1")
print(nn_results[["Model", "Accuracy", "Precision", "Recall", "F1 Score", "Training Time (s)"]])
print("\nDiscussion: Architecture 2 has more capacity, so it may improve accuracy but can also train slower or overfit.")
