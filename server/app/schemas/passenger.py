from typing import Literal

from pydantic import BaseModel, Field


class PassengerIn(BaseModel):
    pclass: int = Field(ge=1, le=3)
    sex: Literal["male", "female"]
    age: float | None = Field(default=None, ge=0, le=120)
    sibsp: int = Field(default=0, ge=0)
    parch: int = Field(default=0, ge=0)
    fare: float = Field(default=0.0, ge=0)
    name: str = Field(default="Mr. Unknown", max_length=120)


class PredictionOut(BaseModel):
    survival_probability: float


class HealthOut(BaseModel):
    status: str
    model_loaded: bool