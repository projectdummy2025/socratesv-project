from fastapi import APIRouter
from schemas import CrisisInput, CrisisOutput
from services.crisis_service import evaluate_crisis_risk

# Initialize Crisis API router
router = APIRouter(prefix="/api/crisis", tags=["crisis"])

# Classify crisis risk endpoint
@router.post("/classify", response_model=CrisisOutput)
def classify_crisis_endpoint(inputData: CrisisInput):
    return evaluate_crisis_risk(inputData.transcriptText)
