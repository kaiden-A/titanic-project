# Titanic Project

Full-stack monorepo: React + Vite frontend, FastAPI backend, and a plain scikit-learn ML folder — all Python managed with one [uv](https://docs.astral.sh/uv/) project.

```
.
├── pyproject.toml          # single uv project (one .venv, one uv.lock)
├── uv.lock
├── client/                 # React + Vite + TypeScript (npm)
├── server/                 # FastAPI app (uvicorn runs from here)
│   └── app/
│       ├── main.py         # FastAPI entry
│       ├── config.py       # Pydantic Settings (ML_MODEL_PATH)
│       ├── dependencies.py
│       ├── schemas/        # Pydantic request/response models
│       ├── routers/        # /api/health, /api/predict
│       └── services/       # loads ml/model.pkl and predicts
└── ml/                     # plain ML folder (no package)
    ├── notebooks/          # .ipynb experimentation
    ├── train.py            # pipeline → ml/model.pkl
    ├── data/               # drop Kaggle train.csv here
    └── model.pkl           # self-contained sklearn pipeline (gitignored)
```

## Setup

```bash
uv sync                          # install Python deps into root .venv
npm install                      # install root task runner (concurrently)
cd client && npm install         # install frontend deps
```

## Train the model

```bash
uv run python ml/train.py
```

Writes `ml/model.pkl` (a self-contained sklearn `Pipeline` — preprocessing + classifier, so the server needs no shared code). If `ml/data/train.csv` is missing, it downloads the standard public Titanic dataset. For experiments, run the notebooks instead:

```bash
uv run jupyter lab ml/notebooks
```

## API endpoints

- `GET  /api/health` — server + model status
- `POST /api/predict` — body: `{"pclass": 1, "sex": "female", "age": 30, "sibsp": 0, "parch": 0, "fare": 32, "name": "Mrs. ..."}` → `{"survival_probability": 0.98}`
- Interactive docs at `http://127.0.0.1:8000/docs`

The server simply `joblib.load`s `ml/model.pkl` via `ML_MODEL_PATH` (see `server/app/config.py`; overridable with `ML_MODEL_PATH=...` in `.env`).

## Run everything at once

```bash
npm run dev        # starts API (:8000, --reload) and web (:5173) together
```

Or separately:

```bash
uv run --directory server uvicorn app.main:app --reload --port 8000
cd client && npm run dev    # opens on http://localhost:5173 (proxies /api → :8000)
```

## Dev tooling

```bash
uv run ruff check .        # lint (config in root pyproject.toml)
uv run pytest              # tests (configured, none yet)
cd client && npm run build && npm run lint
```
