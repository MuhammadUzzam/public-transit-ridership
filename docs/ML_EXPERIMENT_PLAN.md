# Model evaluation

M06 calculates per-route/station thresholds using data from 2022 through September 2023, then creates Normal/High labels and a 91-day lag. M07 adds calendar, lagged and rolling historical features.

For each historical evaluation year, M07 trains through a cutoff 91 days before January 1. It compares XGBoost (bus) or LightGBM (rail) with a Decision Tree, a 91-day baseline and a 364-day baseline. It reports accuracy, balanced accuracy and class F1 for 2024, 2025 and January–August 2026, plus 2026 classification reports and confusion matrices.

For the model bundles in the reviewed snapshot, 2026 accuracy is approximately 88.43% for bus and 89.15% for rail. These are historical results on eligible rows, not evidence of live performance. Retraining can produce different predictions and metrics.

2024–2026 have already been explored; they are not untouched final tests. The 91-day delay is assumed, and actual publication timing and historical revisions are unverified. Class counts and per-class results should be reported alongside overall accuracy.
