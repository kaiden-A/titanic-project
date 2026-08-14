from fastapi import FastAPI

from app.routers.predict_router import router

app = FastAPI(title="Titanic API", version="0.1.0")
app.include_router(router)