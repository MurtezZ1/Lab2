"""
Task 7 - Compare K-Means clusters with actual DemandLevel labels.

Outputs:
- Crosstab table
- Heatmap
- Matching percentage
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(PROJECT_ROOT))

from src.pipeline_dyqani_elektronik import clustering_workflow, load_dataset


df = load_dataset()
_, crosstab, matching_percentage = clustering_workflow(df)

print("\nTask 7: Cluster and DemandLevel Crosstab")
print(crosstab)
print(f"\nMatching percentage: {matching_percentage:.2f}%")
print("\nConclusion: higher matching means K-Means clusters are closer to the real demand categories.")
