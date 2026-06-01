"""
Task 4 - Neural Network Hyperparameter Tuning with GridSearchCV.

Tuned parameters:
- Hidden layers
- Learning rate
- Activation function
- Alpha
- Batch size
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(PROJECT_ROOT))

from src.pipeline_dyqani_elektronik import load_dataset, neural_network_grid_search


df = load_dataset()
grid_results, best_summary = neural_network_grid_search(df)

print("\nTask 4: Top 10 Neural Network Configurations")
print(grid_results[["rank_test_score", "mean_test_score", "std_test_score", "params"]].head(10))

print("\nBest Neural Network Configuration")
print(best_summary)
