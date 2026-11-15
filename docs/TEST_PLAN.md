# Test plan

- From the project root, run `python -m pytest backend/tests -q` using the project's Python environment. The existing nine checks cover `.gitignore` rules only.
- Review M03/M04 for missing values, duplicates, invalid dates and ridership. Verify M06/M07 thresholds, cutoff dates, class counts and evaluation metrics.
- Start FastAPI and the frontend using the root README. Confirm navigation and the year filter, then test both bus and rail predictions through the website.
- Suggested samples for the supplied model/data snapshot: bus route `1` and rail station `40010` on `2026-06-15`. Also test invalid mode, unknown ID, invalid/out-of-range date, missing history and missing files. Outputs can differ after data updates or retraining.
- Compare chart totals with cleaned data if the snapshot is updated. Check the error message shown when the API is unavailable.

The browser and API checks above are manual checks; they are not covered by the existing Git tests.
