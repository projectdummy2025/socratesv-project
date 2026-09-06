from fastapi import FastAPI
from utils.logger import get_log_timestamp
from routers.cbt_router import router as cbt_router
from routers.crisis_router import router as crisis_router

# Initialize FastAPI application instance
app = FastAPI(title="Socrates CBT Service")

# Register API routers
app.include_router(cbt_router)
app.include_router(crisis_router)

# Health check endpoint
@app.get("/health")
def check_health():
    print(f"{get_log_timestamp()} CBT service health check requested")
    return {"status": "ok", "service": "socrates_cbt_service"}
