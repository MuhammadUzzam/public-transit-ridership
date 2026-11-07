# M03: CTA Data Quality Audit

Run `backend/notebooks/M03_CTA_Data_Quality_Audit.ipynb` from top to bottom with the project Python environment. M02 output files must already be present in `backend/data/processed/`:

- `bus_2022_2025.csv`
- `rail_2022_2025.csv`

The notebook reads the files without changing them. It shows row counts, columns, sample rows, missing values, dates, duplicates, ride values and day types. Duplicate ID/date counts exclude rows with a missing ID or missing/invalid date. Zero rides do not automatically mean an error. Calendar gap analysis is not included. The notebook does not create or update a JSON report. Any earlier JSON is a historical snapshot, not a fresh result from this version.

## Manual checks

- Compare the row counts and date range with the M02 output.
- Review the sample rows and inspect the results for missing, duplicate or invalid values.
- If testing with intentionally changed values, use copies of the CSVs and keep the original files untouched.

M02's filtering script remains unchanged. The earlier `backend/tests/test_audit_cta_data.py` tests the previous notebook's internal functions and JSON report and is not compatible with this simplified notebook. Remove or rewrite that specific test before running the full test suite; keep unrelated tests. The notebook can be run directly for manual validation.
