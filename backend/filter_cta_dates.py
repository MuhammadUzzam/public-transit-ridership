from pathlib import Path
import pandas as pd


backend = Path(__file__).resolve().parent

raw_folder = backend / "data" / "raw"
output_folder = backend / "data" / "processed"

datasets = [
    (
        "bus_original.csv",
        "bus_2022_2025.csv",
        {"route", "date", "daytype", "rides"}
    ),
    (
        "rail_original.csv",
        "rail_2022_2025.csv",
        {"station_id", "stationname", "date", "daytype", "rides"}
    )
]


output_folder.mkdir(parents=True, exist_ok=True)

for input_name, output_name, _ in datasets:
    if not (raw_folder / input_name).is_file():
        raise FileNotFoundError(f"File nahi mili: {raw_folder / input_name}")

    if (output_folder / output_name).exists():
        raise FileExistsError(f"Output already exists: {output_folder / output_name}")


results = []

for input_name, output_name, required_columns in datasets:
    data = pd.read_csv(
        raw_folder / input_name,
        dtype=str,
        keep_default_na=False,
        encoding="utf-8-sig"
    )

    missing = required_columns - set(data.columns)

    if missing:
        raise ValueError(f"{input_name}: missing columns: {sorted(missing)}")

    dates = pd.to_datetime(
        data["date"].str.strip(),
        format="mixed",
        errors="coerce"
    )

    if dates.isna().any():
        raise ValueError(f"{input_name}: {dates.isna().sum()} invalid dates found")

    selected = (dates >= "2022-01-01") & (dates < "2026-01-01")
    filtered = data.loc[selected].copy()

    if filtered.empty:
        raise ValueError(f"{input_name}: 2022–2025 ki koi row nahi mili")

    first_date = dates.loc[selected].min().date()
    last_date = dates.loc[selected].max().date()

    print(
        f"{input_name}: total={len(data):,}; "
        f"selected={len(filtered):,}; "
        f"date range={first_date} to {last_date}"
    )

    results.append((output_name, filtered))


for output_name, filtered in results:
    filtered.to_csv(output_folder / output_name, index=False, encoding="utf-8")
    print(f"Saved: {output_folder / output_name}")