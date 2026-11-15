# TransitPulse: CTA Historical Ridership

TransitPulse is a university project that explores Chicago Transit Authority bus route boardings and rail station entries. Separate models classify historical daily ridership as **Normal** or **High** relative to each route or station's own threshold.

The React dashboard displays monthly ridership trends and sends historical prediction requests to a FastAPI backend. The bus and train animations are decorative.

## Project workflow

| Module | Work |
| --- | --- |
| M01–M02 | Setup and filtering CTA datasets |
| M03–M05 | Data audit, cleaning and exploratory analysis |
| M06 | Binary targets and historical features |
| M07 | Model training, baseline comparison and evaluation |
| M08 | Historical prediction examples |
| Application | FastAPI backend and React frontend |

The bus model uses XGBoost; the rail model uses LightGBM. M07 also compares Decision Trees and 91-day/364-day baselines.

## Run the project locally

From the project root in **Windows CMD**, start the backend:

```cmd
"%USERPROFILE%\cta-m03-venv\Scripts\python.exe" -m uvicorn main:app --app-dir backend --reload
```

Keep that terminal open. In a second CMD window opened in the project root, start the frontend:

```cmd
cd frontend
node ".\node_modules\vite\bin\vite.js" --host 127.0.0.1
```

Open the **Local** URL displayed in the frontend terminal. Stop each server with `Ctrl+C`. For useful local checks and notebook notes, see [local run notes](docs/SETUP.md).

## Data and limitations

- Data sources: [CTA bus routes](https://data.cityofchicago.org/Transportation/CTA-Ridership-Bus-Routes-Daily-Totals-by-Route/jyb9-n7fm) and [CTA rail stations](https://data.cityofchicago.org/Transportation/CTA-Ridership-L-Station-Entries-Daily-Totals/5neh-572f).
- The dashboard chart uses a saved 2022–2025 monthly summary; it does not update automatically.
- The prediction form covers January–August 2026 for known locations with sufficient historical records.
- This is a **historical simulation**, not live tracking, a crowding estimate or automatic vehicle allocation. The 91-day availability delay is an assumption.
- The 2024–2026 evaluation periods were explored during development and are not untouched final tests.

## Project structure

| Path | Purpose |
| --- | --- |
| `backend/notebooks/` | Data preparation, EDA, modeling and prediction examples |
| `backend/main.py` | FastAPI routes |
| `backend/predict_ridership.py` | Loads models and historical data for predictions |
| `backend/data/`, `backend/models/` | Local data and model files |
| `frontend/` | React dashboard and monthly summary |
| `docs/` | Architecture, data, evaluation and test notes |

Independent university project; not affiliated with CTA.
