from app.schemas.passenger import HealthOut, PassengerIn, PredictionOut
from app.services.ml_service import model_is_available, predict_survival
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api", tags=["predict"])


@router.get("/health", response_model=HealthOut)
def health() -> HealthOut:
    return HealthOut(status="ok", model_loaded=model_is_available())


@router.post("/predict", response_model=PredictionOut)
def predict(passenger: PassengerIn) -> PredictionOut:
    if not model_is_available():
        raise HTTPException(
            status_code=503,
            detail="Model not trained. Run `uv run python ml/train.py` first.",
        )
    probability = predict_survival(passenger.model_dump())
    return PredictionOut(survival_probability=round(probability, 4))