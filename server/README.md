# server

FastAPI app in the style of a typical practice project (no database needed here).

```
server/
└── app/
    ├── main.py            # FastAPI entry — includes routers
    ├── config.py          # Pydantic Settings (model path from env)
    ├── dependencies.py    # shared FastAPI dependencies
    ├── schemas/           # Pydantic request/response models
    ├── routers/           # API endpoints
    └── services/          # business logic (loads ml/model.pkl)
```

Run: `uv run --directory server uvicorn app.main:app --reload --port 8000`