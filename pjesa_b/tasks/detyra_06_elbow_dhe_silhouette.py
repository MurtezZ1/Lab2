"""
Task 6 - Elbow Method and Silhouette Score.

The best K is selected by reviewing both inertia and silhouette score.
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(PROJECT_ROOT))

from src.pipeline_dyqani_elektronik import clustering_workflow, load_dataset


df = load_dataset()
cluster_metrics, _, _ = clustering_workflow(df)

best_row = cluster_metrics.sort_values("Silhouette Score", ascending=False).iloc[0]

print("\nTask 6: Elbow and Silhouette Results")
print(cluster_metrics)
print(f"\nSelected K by highest silhouette score: {int(best_row['K'])}")
print("Elbow and silhouette plots are saved in outputs/figures/.")
