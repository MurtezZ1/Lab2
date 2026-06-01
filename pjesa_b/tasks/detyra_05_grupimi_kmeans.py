"""
Task 5 - K-Means Clustering.

The target column DemandLevel is removed before clustering.
K values tested: 2, 3, 4, 5, and 6.
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(PROJECT_ROOT))

from src.pipeline_dyqani_elektronik import clustering_workflow, load_dataset


df = load_dataset()
cluster_metrics, _, _ = clustering_workflow(df)

print("\nTask 5: K-Means Clustering Metrics")
print(cluster_metrics)
print("\nPCA cluster plots and distribution charts are saved in outputs/figures/.")
