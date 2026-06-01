"""
Task 2 - Neural Network Architecture 1 using MLPClassifier.

Architecture:
- Input layer from preprocessed features
- Hidden layer with 50 neurons
- Output layer for DemandLevel classes
- ReLU activation
- Adam optimizer
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(PROJECT_ROOT))

from src.pipeline_dyqani_elektronik import classification_workflow, load_dataset


df = load_dataset()
results, _ = classification_workflow(df)

nn1 = results[results["Model"] == "Neural Network Architecture 1"]

print("\nTask 2: Neural Network Architecture 1 Results")
print(nn1[["Model", "Accuracy", "Precision", "Recall", "F1 Score", "Training Time (s)"]])
print("\nDesign decision: one hidden layer keeps the model simple while still allowing nonlinear learning.")
