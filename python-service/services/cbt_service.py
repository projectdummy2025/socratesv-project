import os
import json
from google import genai
from google.genai import types
from utils.logger import get_log_timestamp
from schemas import ThoughtOutput

# System prompt for Socratic CBT questioning
CBT_SYSTEM_PROMPT = (
    "You are Socrates, a compassionate CBT therapist guiding a client through Cognitive Restructuring. "
    "Given the user's automatic negative thought (Catch stage), provide ONE insightful Socratic challenge "
    "question (Challenge stage) and ONE balanced replacement thought (Replace stage) in Indonesian."
)

# Initialize Google GenAI client instance
def create_genai_client() -> genai.Client | None:
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        print(f"{get_log_timestamp()} Warning: GEMINI_API_KEY environment variable not set")
        return None
    try:
        return genai.Client(api_key=api_key)
    except Exception as init_error:
        print(f"{get_log_timestamp()} Failed initializing GenAI client: {init_error}")
        return None

# Process negative thought using CBT Socratic reasoning framework
def process_cbt_thought(thoughtText: str) -> ThoughtOutput:
    print(f"{get_log_timestamp()} Processing CBT thought restructuring")
    genai_client = create_genai_client()

    if not genai_client:
        return ThoughtOutput(
            currentStep="challenge",
            challengeQuestion=f"Apakah ada bukti nyata yang mendukung pikiran: '{thoughtText}'?",
            replacementThought="Mari kita lihat situasi ini dari sudut pandang yang lebih seimbang."
        )

    try:
        response = genai_client.models.generate_content(
            model="gemma-4-26b-a4b-it",
            config=types.GenerateContentConfig(
                system_instruction=CBT_SYSTEM_PROMPT,
                response_mime_type="application/json",
                response_schema={
                    "type": "OBJECT",
                    "properties": {
                        "challengeQuestion": {"type": "STRING"},
                        "replacementThought": {"type": "STRING"}
                    },
                    "required": ["challengeQuestion", "replacementThought"]
                }
            ),
            contents=f"Pikiran otomatis pengguna: {thoughtText}"
        )
        
        parsed_data = json.loads(response.text or "{}")
        challenge_text = parsed_data.get("challengeQuestion", f"Apakah ada bukti bahwa '{thoughtText}' sepenuhnya benar?")
        replacement_text = parsed_data.get("replacementThought", "Cobalah melihat situasi ini dengan perspektif seimbang.")

        return ThoughtOutput(
            currentStep="challenge",
            challengeQuestion=challenge_text,
            replacementThought=replacement_text
        )
    except Exception as error_instance:
        print(f"{get_log_timestamp()} Error calling Gemini API: {error_instance}")
        return ThoughtOutput(
            currentStep="challenge",
            challengeQuestion=f"Apakah ada bukti yang mendukung pikiran: '{thoughtText}'?",
            replacementThought="Mari kita pertimbangkan penjelasan alternatif lain."
        )
