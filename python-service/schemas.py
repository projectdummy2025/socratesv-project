from pydantic import BaseModel

# Input schema for thought analysis
class ThoughtInput(BaseModel):
    userThought: str

# Output schema for CBT analysis response
class ThoughtOutput(BaseModel):
    currentStep: str
    challengeQuestion: str
    replacementThought: str

# Input schema for crisis classification
class CrisisInput(BaseModel):
    transcriptText: str

# Output schema for crisis classification
class CrisisOutput(BaseModel):
    isDangerous: bool
    riskLevel: str
    reasonText: str
