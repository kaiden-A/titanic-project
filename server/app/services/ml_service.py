import re
from functools import lru_cache

import joblib
import pandas as pd

from app.config import settings

TITLE_RANK = {"Mr": 0, "Miss": 1, "Mrs": 2, "Master": 3}


@lru_cache(maxsize=1)
def get_model():
    if not settings.ml_model_path.exists():
        raise FileNotFoundError(
            f"No model at {settings.ml_model_path}. Run `uv run python ml/train.py` first."
        )
    return joblib.load(settings.ml_model_path)


def model_is_available() -> bool:
    return settings.ml_model_path.exists()


def title_code(name: str) -> int:
    match = re.search(r" ([A-Za-z]+)\.", name)
    title = match.group(1) if match else "Mr"
    return TITLE_RANK.get(title, 4)


def predict_survival(passenger: dict) -> float:
    row = pd.DataFrame(
        [{
            "Pclass": passenger["pclass"],
            "Sex": passenger["sex"],
            "Age": passenger.get("age"),
            "SibSp": passenger.get("sibsp", 0),
            "Parch": passenger.get("parch", 0),
            "Fare": passenger.get("fare", 0.0),
            "Title": title_code(passenger.get("name", "Mr. Unknown")),
        }]
    )
    return float(get_model().predict_proba(row)[0, 1])