from fastapi import APIRouter
from schemas import ThoughtInput, ThoughtOutput
from services.cbt_service import process_cbt_thought

# Initialize CBT API router
router = APIRouter(prefix="/api/cbt", tags=["cbt"])

# Analyze negative thought endpoint
@router.post("/analyze", response_model=ThoughtOutput)
def analyze_thought_endpoint(inputData: ThoughtInput):
    return process_cbt_thought(inputData.userThought)
