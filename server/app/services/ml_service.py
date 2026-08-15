from functools import lru_cache

import joblib
import pandas as pd
from app.config import settings


@lru_cache(maxsize=1)
def get_model():
    if not settings.ml_model_path.exists():
        raise FileNotFoundError(
            f"No model at {settings.ml_model_path}. Run `uv run python ml/train.py` first."
        )
    return joblib.load(settings.ml_model_path)


def model_is_available() -> bool:
    return settings.ml_model_path.exists()


def predict_survival(passenger: dict) -> float:
    row = pd.DataFrame(
        [{
            "Pclass": passenger["pclass"],
            "Sex": passenger["sex"],
            "Age": passenger.get("age"),
            "SibSp": passenger.get("sibsp", 0),
            "Parch": passenger.get("parch", 0),
            "Fare": passenger.get("fare", 0.0),
            "Embarked": passenger.get("embarked"),
        }]
    )
    return float(get_model().predict_proba(row)[0, 1])