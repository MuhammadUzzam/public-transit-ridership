from functools import lru_cache
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from predict_ridership import RidershipPredictor


app = FastAPI(title="CTA Historical Ridership API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class PredictionRequest(BaseModel):
    mode: Literal["bus", "rail"]
    entity_id: str
    date: str


@lru_cache(maxsize=2)
def get_predictor(mode: str):
    try:
        return RidershipPredictor(mode)
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=503,
            detail="Required data or model file is missing. Run the data preparation and M07 first.",
        ) from exc


@app.get("/")
def home():
    return {"message": "CTA historical ridership API is running"}


@app.get("/entities/{mode}")
def entities(mode: Literal["bus", "rail"]):
    return {"mode": mode, "entity_ids": get_predictor(mode).entities()}


@app.post("/predict")
def predict(request: PredictionRequest):
    predictor = get_predictor(request.mode)
    try:
        return predictor.predict(request.entity_id, request.date)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
