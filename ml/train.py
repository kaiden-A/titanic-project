import re
from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OrdinalEncoder, StandardScaler

ROOT = Path(__file__).resolve().parent
DATA_PATH = ROOT / "data" / "train.csv"
MODEL_PATH = ROOT / "model.pkl"
FALLBACK_URL = "https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv"

NUMERIC_COLUMNS = ["Pclass", "Age", "SibSp", "Parch", "Fare"]
CATEGORICAL_COLUMNS = ["Sex", "Title"]
MODEL_COLUMNS = NUMERIC_COLUMNS + CATEGORICAL_COLUMNS

TITLE_RANK = {"Mr": 0, "Miss": 1, "Mrs": 2, "Master": 3}


def title_code(name: str) -> int:
    match = re.search(r" ([A-Za-z]+)\.", name)
    title = match.group(1) if match else "Mr"
    return TITLE_RANK.get(title, 4)


def load_data() -> pd.DataFrame:
    if not DATA_PATH.exists():
        DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
        pd.read_csv(FALLBACK_URL).to_csv(DATA_PATH, index=False)
    return pd.read_csv(DATA_PATH)


def build_model() -> Pipeline:
    preprocessor = ColumnTransformer(
        transformers=[
            (
                "num",
                Pipeline(
                    [
                        ("impute", SimpleImputer(strategy="median")),
                        ("scale", StandardScaler()),
                    ]
                ),
                NUMERIC_COLUMNS,
            ),
            (
                "cat",
                OrdinalEncoder(handle_unknown="use_encoded_value", unknown_value=-1),
                CATEGORICAL_COLUMNS,
            ),
        ]
    )
    return Pipeline(
        [
            ("preprocess", preprocessor),
            ("classifier", RandomForestClassifier(n_estimators=200, random_state=42)),
        ]
    )


def main() -> None:
    df = load_data()
    df["Title"] = df["Name"].astype(str).map(title_code)

    x = df[MODEL_COLUMNS]
    y = df["Survived"].astype(int)

    model = build_model()
    scores = cross_val_score(model, x, y, cv=5)
    model.fit(x, y)

    joblib.dump(model, MODEL_PATH)

    print(f"Saved pipeline to {MODEL_PATH}")
    print(f"Cross-val accuracy: {scores.mean():.4f} +/- {scores.std():.4f}")


if __name__ == "__main__":
    main()
