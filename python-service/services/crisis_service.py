from utils.logger import get_log_timestamp
from schemas import CrisisOutput

# Evaluate crisis risk level on input transcript
def evaluate_crisis_risk(transcriptText: str) -> CrisisOutput:
    print(f"{get_log_timestamp()} Classifying transcript for crisis detection")
    textContent = (transcriptText or "").lower()

    critical_keywords = ["bunuh diri", "suicide", "harm myself", "akhiri hidup", "want to die"]
    for keyword in critical_keywords:
        if keyword in textContent:
            print(f"{get_log_timestamp()} High risk crisis keyword detected: {keyword}")
            return CrisisOutput(
                isDangerous=True,
                riskLevel="high",
                reasonText=f"Detected high risk phrase: {keyword}"
            )

    return CrisisOutput(
        isDangerous=False,
        riskLevel="low",
        reasonText="No crisis indicator detected"
    )
