from datetime import datetime
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Socrates CBT Service")

# Data model for CBT thought analysis input
class ThoughtInput(BaseModel):
    userThought: str

# Data model for CBT thought analysis response
class ThoughtOutput(BaseModel):
    currentStep: str
    challengeQuestion: str
    replacementThought: str

# Format timestamp according to AGENTS.md requirements: (YYYY-MM-DD HH:mm:ss)
def get_log_timestamp() -> str:
    return datetime.now().strftime("(%Y-%m-%d %H:%M:%S)")

# Health check endpoint to verify microservice status
@app.get("/health")
def check_health():
    print(f"{get_log_timestamp()} CBT service health check requested")
    return {"status": "ok", "service": "socrates_cbt_service"}

# Analyze negative thought using CBT framework (Catch -> Challenge -> Replace)
@app.post("/api/cbt/analyze", response_model=ThoughtOutput)
def analyze_thought(inputData: ThoughtInput):
    # Log incoming request for CBT analysis
    print(f"{get_log_timestamp()} Analyzing user thought for CBT processing")

    # Extract user thought string for processing
    thoughtText = inputData.userThought

    # Generate initial challenge question for cognitive restructuring
    questionText = f"What evidence supports the thought: '{thoughtText}'?"

    # Provide balanced alternative thought for cognitive replacement
    replacementText = "Let us look at this situation from a more balanced perspective."

    # Return structured CBT step output
    return ThoughtOutput(
        currentStep="challenge",
        challengeQuestion=questionText,
        replacementThought=replacementText
    )
