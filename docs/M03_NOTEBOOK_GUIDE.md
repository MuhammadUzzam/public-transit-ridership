# M03 standalone notebook

Open `backend/notebooks/M03_CTA_Data_Quality_Audit.ipynb` using the project's Python environment. The M03 audit logic lives in the notebook itself; `audit_cta_data.py` is not required. M02's `filter_cta_dates.py` remains unchanged.

The input CSVs must already exist as `backend/data/processed/bus_2022_2025.csv` and `backend/data/processed/rail_2022_2025.csv`. Run the notebook cells in order. The input CSVs are read only; no cleaning is performed. The JSON report is written to `backend/reports/m03_quality_report.json` only if it does not already exist. If it exists, the notebook shows fresh results in memory but does not change the existing JSON; move or rename the old report before saving a new one.

The test file loads the notebook's tagged `audit-logic` cell using Python's built-in JSON module. It tests the same functions used by the notebook and needs no second copy of the audit logic. Keep that tag on the cell if editing it. Run `python -m pytest backend/tests/test_audit_cta_data.py -q` using the project's environment.

Calendar gaps and zero rides are observations, not automatically data errors. CSVs should remain Git-ignored. Review an existing audit Python file and any imports before choosing whether to remove that old file; this update does not delete it.
