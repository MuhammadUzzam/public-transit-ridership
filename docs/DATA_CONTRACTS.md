# Data and API contracts

- **Bus data:** daily `route`, `date`, `daytype` and `rides` (boardings).
- **Rail data:** daily `station_id`, `stationname`, `date`, `daytype` and `rides` (station entries).
- M02 filters 2022–2025; M04 cleans the data. M06 estimates each eligible location's thresholds from 2022 through September 2023: `High` means rides exceed the upper threshold; otherwise the valid row is `Normal`.
- M07/M08 also read January–August 2026 from the raw CSVs. A location needs a training threshold and the requested date needs a 91-day historical record. The 91-day availability delay is assumed, not verified.

## API

- `GET /` checks that the API is running; `GET /entities/bus` and `GET /entities/rail` return known IDs.
- `POST /predict` accepts JSON such as `{"mode":"bus","entity_id":"1","date":"2026-06-15"}`. `mode` is `bus` or `rail`; the supported date range is 2026-01-01 through 2026-08-31.
- A successful response includes mode, ID, date, `prediction`, `training_cutoff` and `history_cutoff`. Invalid inputs or missing required history return an error; missing model/data files return 503.

Each predictor loads a model bundle, the corresponding cleaned CSV and raw CSV. Raw data, processed data and model bundles are ignored by the project Git rules.
