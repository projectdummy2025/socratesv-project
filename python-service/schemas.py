from typing import List, Optional
from pydantic import BaseModel

# Message item for conversation history
class ChatMessage(BaseModel):
    role: str
    content: str

# Input schema for thought analysis with context history
class ThoughtInput(BaseModel):
    userThought: str
    conversationHistory: Optional[List[ChatMessage]] = []

# Output schema for CBT analysis response with empathy summary
class ThoughtOutput(BaseModel):
    currentStep: str = "challenge"
    empathySummary: str
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
