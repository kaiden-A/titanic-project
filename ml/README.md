# ml

Plain ML folder — notebooks for experimentation, `train.py` for the pipeline.

```
ml/
├── notebooks/    # .ipynb EDA / experiments
├── train.py      # full pipeline → ml/model.pkl
├── data/         # train.csv (drop your Kaggle copy here; auto-downloads if missing)
└── model.pkl     # trained sklearn pipeline (self-contained, gitignored)
```

Train: `uv run python ml/train.py`

The server loads `ml/model.pkl` directly with `joblib.load` — no shared package needed.