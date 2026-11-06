# ML experiment plan

Target: Low / Normal / High relative ridership; exact thresholds are pending training-data analysis. Fit thresholds using appropriate past data only.

Plan: separate bus/rail experiments, majority and historical baselines, Logistic Regression and Decision Tree, chronological splits, multiclass metrics and limited justified tuning. Public-data delay is a simulation assumption, not a fixed fact. Prior binary results are exploratory, not three-class results. No improvement is guaranteed.

Feature values, training labels, threshold fitting and validation must respect the assumed data-availability cutoff. Historical revisions prevent claiming a perfect point-in-time backtest without archived versions.
