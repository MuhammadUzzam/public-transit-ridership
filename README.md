# Public Transit Ridership Forecasting and Planning Support System

University project for AIES (CCP and CCA) and PAI (CCA). It will study CTA bus route boardings and rail station entries, using historical simulation to classify relative ridership as Low, Normal or High. It is not a live CTA prediction or automatic vehicle allocation system.

## M01 status

This is the initial project setup. Data processing, ML, the FastAPI application and the React frontend are **not implemented yet**. The backend and frontend are kept in separate folders. See [progress](docs/PROGRESS.md).

## Setup and tests

Requirements: Python 3.10 or later and Git. In a terminal opened at the project root:

```bash
python -m venv backend/.venv
```

Activate on Windows PowerShell:

```powershell
.\backend\.venv\Scripts\Activate.ps1
```

On macOS/Linux:

```bash
source backend/.venv/bin/activate
```

Install the current development dependency and run the setup tests:

```bash
python -m pip install -r backend/requirements-dev.txt
python -m pytest backend/tests -q
```

The tests use Git to check that representative private and generated files are ignored. Further application dependencies are intentionally deferred until their modules are implemented. Package installation requires access to a Python package index.

## Planned data

- [CTA bus routes daily ridership](https://data.cityofchicago.org/Transportation/CTA-Ridership-Bus-Routes-Daily-Totals-by-Route/jyb9-n7fm)
- [CTA rail station daily entries](https://data.cityofchicago.org/Transportation/CTA-Ridership-L-Station-Entries-Daily-Totals/5neh-572f)

Dataset downloads and reproducible processing will be implemented in later approved modules. Do not commit raw/processed datasets, models, environments or credentials.

See [project specification](docs/PROJECT_SPEC.md), [architecture](docs/ARCHITECTURE.md), and [requirements matrix](docs/REQUIREMENTS_MATRIX.md).
