# Architecture

CTA bus and rail CSVs → filter, audit, cleaning and EDA → binary targets and historical features → separate model and baseline comparisons → saved bus and rail model bundles.

For a historical prediction, the React form sends a request through Vite's `/api` development proxy to FastAPI. `backend/main.py` calls `predict_ridership.py`, which loads the appropriate bundle and historical CSVs, prepares features and returns Normal/High. Predictors are cached; restart the API after changing their files.

The 2022–2025 chart uses the separate static `frontend/src/monthly.json` snapshot. Animations are decorative. Hosting a production build requires an explicit `/api` route to the backend.
