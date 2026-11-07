# Public Transit Ridership Forecasting and Planning Support System

University project for AIES (CCP and CCA) and PAI (CCA). It studies CTA bus route boardings and rail station entries. The planned system will use historical simulation to classify relative ridership as Low, Normal or High.

This is not a live CTA prediction or automatic vehicle allocation system.

## Current status

- M01: Initial project structure and test setup completed.
- M02: CTA datasets downloaded manually and filtered to 2022–2025.
- M03: Simplified data-quality audit notebook created; local results are being verified.

Data cleaning, machine learning models, the FastAPI application and the React frontend are not implemented yet.

## Python environment

The project uses a virtual environment stored at a short path on Windows. This helps avoid Windows path-length problems.

To create the environment, if it does not already exist:

```powershell
py -3 -m venv "$env:USERPROFILE\cta-m03-venv"
```

From the project root, install the development dependencies:

```powershell
& "$env:USERPROFILE\cta-m03-venv\Scripts\python.exe" -m pip install -r backend/requirements-dev.txt
```

Verify the installation:

```powershell
& "$env:USERPROFILE\cta-m03-venv\Scripts\python.exe" -c "import pandas, pytest, ipykernel; print('Setup OK')"
```

For notebooks in VS Code, select the Python interpreter from:

```text
C:\Users\<your-username>\cta-m03-venv\Scripts\python.exe
```

## Dataset download and filtering

Download the original CSV files manually:

- [CTA Bus Routes — Daily Ridership](https://data.cityofchicago.org/Transportation/CTA-Ridership-Bus-Routes-Daily-Totals-by-Route/jyb9-n7fm)
- [CTA Rail Station Entries — Daily Totals](https://data.cityofchicago.org/Transportation/CTA-Ridership-L-Station-Entries-Daily-Totals/5neh-572f)

Save them in `backend/data/raw/` as:

- `bus_original.csv`
- `rail_original.csv`

From the project root, run:

```powershell
& "$env:USERPROFILE\cta-m03-venv\Scripts\python.exe" backend/filter_cta_dates.py
```

The script selects records from 1 January 2022 through 31 December 2025 and saves separate CSV files in `backend/data/processed/`. The original CSV files remain unchanged.

If an output file already exists, the script stops instead of overwriting it.

## Data-quality audit

Open and run:

```text
backend/notebooks/M03_CTA_Data_Quality_Audit.ipynb
```

Select the short-path virtual environment as the notebook kernel and run the cells in order.

The notebook displays an overview of both datasets and checks missing values, dates, duplicate records, ridership values and day types. It does not clean or modify the input CSVs.

The results are displayed in the notebook. This version does not create or update a JSON report.

Zero ridership is not automatically an error. Any potential issue should be reviewed before deciding how to handle it.

See [M03 Notebook Guide](docs/M03_NOTEBOOK_GUIDE.md) for more details.

## Git

Do not commit raw or processed datasets, virtual environments, credentials or unnecessary generated files.