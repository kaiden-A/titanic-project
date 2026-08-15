# ml

This is a template — the ML training files are intentionally **not** included here.

The complete training setup lives on the **`solution`** branch:

- `ml/notebooks/main.ipynb` — EDA / experiments
- `ml/train.py` — pipeline → `ml/model.pkl`
- `ml/data/train.csv` — training data (gitignored)

You will need to create them yourself. The API (`server/`) only needs `ml/model.pkl`,
so you can train the model on the `solution` branch and copy the artifact over, or
follow the same pipeline from scratch.
