from app.services.ml_service import get_model, model_is_available


def get_pipeline():
    if not model_is_available():
        return None
    return get_model()