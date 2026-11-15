from pathlib import Path

import joblib
import numpy as np
import pandas as pd


BACKEND = Path(__file__).resolve().parent


class RidershipPredictor:
    def __init__(self, mode):
        if mode not in ("bus", "rail"):
            raise ValueError("Mode must be 'bus' or 'rail'.")

        self.mode = mode
        self.bundle = joblib.load(BACKEND / "models" / f"{mode}_binary_model.joblib")
        id_column = "route" if mode == "bus" else "station_id"

        history = pd.read_csv(
            BACKEND / "data" / "processed" / f"{mode}_cleaned.csv",
            dtype={id_column: str}, parse_dates=["date"]
        )
        history = history.rename(columns={id_column: "entity_id"})
        history = history[["entity_id", "date", "rides"]]

        recent = pd.read_csv(
            BACKEND / "data" / "raw" / f"{mode}_original.csv",
            usecols=[id_column, "date", "rides"], dtype=str
        )
        recent["date"] = pd.to_datetime(recent["date"].str.strip(), format="mixed")
        recent = recent[recent["date"].between("2026-01-01", "2026-08-31 23:59:59")].copy()
        recent = recent.rename(columns={id_column: "entity_id"})
        recent["entity_id"] = recent["entity_id"].str.strip()
        recent["date"] = recent["date"].dt.normalize()
        recent["rides"] = pd.to_numeric(recent["rides"].str.replace(",", "", regex=False))

        self.history = pd.concat(
            [history, recent[["entity_id", "date", "rides"]]], ignore_index=True
        ).sort_values(["entity_id", "date"])
        if self.history.duplicated(["entity_id", "date"]).any():
            raise ValueError("Duplicate route/station and date in historical data.")

    def entities(self):
        return sorted(self.bundle["entity_codes"])

    def predict(self, entity_id, date):
        entity_id = str(entity_id).strip()
        if entity_id not in self.bundle["entity_codes"]:
            raise ValueError("Unknown route/station or missing training threshold.")
        try:
            date = pd.Timestamp(date)
            if pd.isna(date) or date.tzinfo is not None or date != date.normalize():
                raise ValueError
        except (TypeError, ValueError, OverflowError):
            raise ValueError("Enter a valid date without a time or timezone.") from None

        if not pd.Timestamp("2026-01-01") <= date <= pd.Timestamp("2026-08-31"):
            raise ValueError("Historical demonstration supports dates from 2026-01-01 to 2026-08-31.")
        cutoff = pd.Timestamp(self.bundle["training_cutoff"])
        if date - cutoff < pd.Timedelta(days=91):
            raise ValueError("Model training cutoff is too close to the requested date.")

        limit = self.bundle["thresholds"]
        row = limit.loc[limit["entity_id"] == entity_id].iloc[0]
        lower, upper = float(row["lower"]), float(row["upper"])
        history_cutoff = date - pd.Timedelta(days=91)
        past = self.history[
            (self.history["entity_id"] == entity_id) & (self.history["date"] <= history_cutoff)
        ].set_index("date")["rides"]

        values = {
            "entity_code": self.bundle["entity_codes"][entity_id],
            "weekday": date.dayofweek, "month": date.month, "dom": date.day,
            "lower": lower, "upper": upper
        }
        for days in [91, 98, 105, 112, 119, 364]:
            values[f"lag{days}"] = past.get(date - pd.Timedelta(days=days), np.nan)
        if pd.isna(values["lag91"]):
            raise ValueError("The required 91-day historical ridership record is missing.")

        for days in [7, 28, 56]:
            window = past[(past.index > history_cutoff - pd.Timedelta(days=days)) & (past.index <= history_cutoff)]
            values[f"avg{days}"] = window.mean()
        for column in ["lag91", "lag98", "lag105", "lag112", "lag119", "lag364", "avg7", "avg28", "avg56"]:
            values[f"rel_{column}"] = (values[column] - lower) / (upper - lower)

        features = pd.DataFrame([values])[self.bundle["features"]]
        prediction = int(self.bundle["model"].predict(features)[0])
        return {
            "mode": self.mode,
            "entity_id": entity_id,
            "date": date.strftime("%Y-%m-%d"),
            "prediction": self.bundle["classes"][prediction],
            "training_cutoff": self.bundle["training_cutoff"],
            "history_cutoff": history_cutoff.strftime("%Y-%m-%d")
        }
