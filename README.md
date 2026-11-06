# Public Transit Ridership Forecasting and Planning Support System

University project for AIES (CCP and CCA) and PAI (CCA). The project studies CTA bus route boardings and rail station entries. It will use historical simulation to classify relative ridership as Low, Normal or High.

This is not a live CTA prediction or automatic vehicle allocation system.

## Current status

- M01: Initial project structure and test setup completed.
- M02: CTA datasets downloaded manually and filtered to the 2022–2025 date range.
- M03: Detailed data-quality audit is pending.

Data cleaning, machine learning models, the FastAPI application and the React frontend are not implemented yet.

## Setup and tests

Requirements: Python 3.10 or later and Git.

From the project root, create a virtual environment:

```bash
python -m venv backend/.venv
```

Activate it on Windows PowerShell:

```powershell
.\backend\.venv\Scripts\Activate.ps1
```

On macOS/Linux:

```bash
source backend/.venv/bin/activate
```

Install the dependencies and run the tests:

```bash
python -m pip install -r backend/requirements-dev.txt
python -m pytest backend/tests -q
```

The current setup tests use Git to check that representative private and generated files are ignored. Package installation requires internet access.

## Dataset download and date filtering

Download the original CSV files manually from the official sources:

- [CTA Bus Routes — Daily Ridership](https://data.cityofchicago.org/Transportation/CTA-Ridership-Bus-Routes-Daily-Totals-by-Route/jyb9-n7fm)
- [CTA Rail Station Entries — Daily Totals](https://data.cityofchicago.org/Transportation/CTA-Ridership-L-Station-Entries-Daily-Totals/5neh-572f)

Save the original files in `backend/data/raw/` with these names:

- `bus_original.csv`
- `rail_original.csv`

From the project root, run:

```powershell
.\backend\.venv\Scripts\python.exe backend/filter_cta_dates.py
```

The script selects records from 1 January 2022 through 31 December 2025 and creates:

- `backend/data/processed/bus_2022_2025.csv`
- `backend/data/processed/rail_2022_2025.csv`

The original CSV files remain unchanged. If an output file already exists, the script will stop rather than overwrite it.

These files are date-filtered only; the detailed data-quality audit and cleaning are still pending. Raw and processed datasets, models, virtual environments and credentials should not be committed to Git.

## Documentation

See the [project specification](docs/PROJECT_SPEC.md), [architecture](docs/ARCHITECTURE.md), [requirements matrix](docs/REQUIREMENTS_MATRIX.md) and [progress](docs/PROGRESS.md).