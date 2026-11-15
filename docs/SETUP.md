# Local run notes

Open Windows Command Prompt (CMD) in the project root. The project uses the existing `cta-m03-venv` Python environment and installed frontend dependencies.

## Backend

```cmd
"%USERPROFILE%\cta-m03-venv\Scripts\python.exe" -m uvicorn main:app --app-dir backend --reload
```

Keep this terminal open. The API documentation is at <http://127.0.0.1:8000/docs>.

## Frontend

Open a second CMD window in the project root:

```cmd
cd frontend
node ".\node_modules\vite\bin\vite.js" --host 127.0.0.1
```

Open the Local URL printed by Vite. This direct Node command handles the existing folder path containing `&`. Stop each server with `Ctrl+C`.

## Useful checks

- The API reads the raw bus and rail CSVs, cleaned CSVs and saved bus and rail model bundles from `backend/data/` and `backend/models/`.
- Use a known route/station ID and a date from 2026-01-01 through 2026-08-31 with sufficient past data. Example: bus route `1` or rail station `40010`, on `2026-06-15`.
- Restart the API after changing model or data files; predictors are cached.
- M03–M07 contain absolute Windows paths. Check them if the project is moved. M04 overwrites cleaned CSVs, M06 overwrites binary data and thresholds, and M07 overwrites saved models when rerun.
- M08 assumes its working directory is `backend/notebooks/` when importing the prediction module.
- `frontend/src/monthly.json` is a saved summary; the dashboard and M05 do not regenerate it automatically.

To run the existing Git ignore tests from the project root:

```cmd
"%USERPROFILE%\cta-m03-venv\Scripts\python.exe" -m pytest backend\tests -q
```

These tests check Git ignore rules; they do not test predictions or the website.
