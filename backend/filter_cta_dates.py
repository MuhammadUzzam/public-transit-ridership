"""Filter manually downloaded CTA CSVs to 2022–2025 without changing originals."""

from pathlib import Path
import sys
import tempfile

import pandas as pd

# Save this file in the project's backend folder.
BACKEND = Path(__file__).resolve().parent
RAW = BACKEND / "data" / "raw"
OUTPUT = BACKEND / "data" / "processed"
START = pd.Timestamp("2022-01-01")
END_EXCLUSIVE = pd.Timestamp("2026-01-01")
FILES = [
    ("bus_original.csv", "bus_2022_2025.csv", {"route", "date", "daytype", "rides"}),
    ("rail_original.csv", "rail_2022_2025.csv", {"station_id", "stationname", "date", "daytype", "rides"}),
]


def filter_file(source, target, required_columns):
    """Filter one CSV in chunks, retaining original values and columns."""
    total = selected = 0
    first_date = last_date = None
    header_written = False
    for chunk in pd.read_csv(source, dtype=str, keep_default_na=False,
                             encoding="utf-8-sig", chunksize=100_000):
        missing_columns = required_columns - set(chunk.columns)
        if missing_columns:
            raise ValueError(f"{source.name}: missing columns {sorted(missing_columns)}")

        # CTA dates use US month/day/year; ISO dates also parse correctly.
        dates = pd.to_datetime(chunk["date"].str.strip(), format="mixed",
                               errors="coerce", dayfirst=False)
        invalid = dates.isna()
        if invalid.any():
            example = chunk.loc[invalid, "date"].iloc[0]
            raise ValueError(f"{source.name}: {invalid.sum()} invalid/empty dates in a chunk; example {example!r}")

        keep = (dates >= START) & (dates < END_EXCLUSIVE)
        matching = chunk.loc[keep]
        matching_dates = dates.loc[keep]
        matching.to_csv(target, mode="a", index=False, header=not header_written,
                        encoding="utf-8")
        header_written = True
        total += len(chunk)
        selected += len(matching)
        if not matching_dates.empty:
            low, high = matching_dates.min(), matching_dates.max()
            first_date = low if first_date is None else min(first_date, low)
            last_date = high if last_date is None else max(last_date, high)

    if not header_written:
        raise ValueError(f"{source.name}: CSV has no data rows")
    if not selected:
        raise ValueError(f"{source.name}: no rows found in the selected range")
    print(f"{source.name}: total={total:,}; selected={selected:,}; "
          f"date range={first_date.date()} to {last_date.date()}")


def main():
    for input_name, output_name, _ in FILES:
        if not (RAW / input_name).is_file():
            raise FileNotFoundError(f"File not found: {RAW / input_name}")
        if (OUTPUT / output_name).exists():
            raise FileExistsError(f"Output already exists: {OUTPUT / output_name}; move it before running again")

    OUTPUT.mkdir(parents=True, exist_ok=True)
    # Stage both files first: invalid data in one does not leave a finished output.
    with tempfile.TemporaryDirectory(dir=OUTPUT) as temp_dir:
        staging = Path(temp_dir)
        for input_name, output_name, required in FILES:
            filter_file(RAW / input_name, staging / output_name, required)
        for _, output_name, _ in FILES:
            (staging / output_name).rename(OUTPUT / output_name)
    print(f"Done. Filtered files are in: {OUTPUT}")


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, pd.errors.ParserError) as error:
        print(f"Error: {error}", file=sys.stderr)
        raise SystemExit(1) from error
