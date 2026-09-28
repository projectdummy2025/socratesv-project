import os
import json
from typing import List
from google import genai
from google.genai import types
from utils.logger import get_log_timestamp
from schemas import ChatMessage, ThoughtOutput

# System prompt for empathetic CBT Socratic questioning and active listening
CBT_SYSTEM_PROMPT = (
    "You are Socrates, a compassionate and empathetic CBT therapist guiding a client through Cognitive Restructuring in Indonesian. "
    "First, validate the user's emotion and summarize their experience empathetically (empathySummary) using active listening. "
    "Second, provide ONE thoughtful Socratic challenge question (challengeQuestion). "
    "Third, provide ONE balanced replacement perspective (replacementThought)."
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

# Format conversation turns into prompt context string
def format_conversation_context(thoughtText: str, historyTurns: List[ChatMessage]) -> str:
    if not historyTurns:
        return f"Pikiran/ungkapan pengguna: {thoughtText}"

    formatted_turns = []
    for turn in historyTurns[-6:]:
        speaker = "Pengguna" if turn.role == "user" else "Socrates"
        formatted_turns.append(f"{speaker}: {turn.content}")

    history_block = "\n".join(formatted_turns)
    return f"Riwayat percakapan sebelumnya:\n{history_block}\n\nPikiran/ungkapan terbaru pengguna: {thoughtText}"

# Process negative thought using CBT Socratic reasoning framework
def process_cbt_thought(thoughtText: str, conversationHistory: List[ChatMessage] = []) -> ThoughtOutput:
    print(f"{get_log_timestamp()} Processing CBT thought restructuring with context")
    genai_client = create_genai_client()

    default_empathy = f"Saya mendengar dan memahami bahwa situasi ini terasa berat bagi Anda saat memikirkan: '{thoughtText}'."
    default_challenge = f"Apakah ada bukti nyata yang mendukung pikiran: '{thoughtText}'?"
    default_replacement = "Mari kita pertimbangkan situasi ini dari sudut pandang yang lebih seimbang."

    if not genai_client:
        return ThoughtOutput(
            currentStep="challenge",
            empathySummary=default_empathy,
            challengeQuestion=default_challenge,
            replacementThought=default_replacement
        )

    prompt_content = format_conversation_context(thoughtText, conversationHistory)

    try:
        response = genai_client.models.generate_content(
            model="gemma-4-26b-a4b-it",
            config=types.GenerateContentConfig(
                system_instruction=CBT_SYSTEM_PROMPT,
                response_mime_type="application/json",
                response_schema={
                    "type": "OBJECT",
                    "properties": {
                        "empathySummary": {"type": "STRING"},
                        "challengeQuestion": {"type": "STRING"},
                        "replacementThought": {"type": "STRING"}
                    },
                    "required": ["empathySummary", "challengeQuestion", "replacementThought"]
                }
            ),
            contents=prompt_content
        )

        parsed_data = json.loads(response.text or "{}")
        empathy_text = parsed_data.get("empathySummary", default_empathy)
        challenge_text = parsed_data.get("challengeQuestion", default_challenge)
        replacement_text = parsed_data.get("replacementThought", default_replacement)

        return ThoughtOutput(
            currentStep="challenge",
            empathySummary=empathy_text,
            challengeQuestion=challenge_text,
            replacementThought=replacement_text
        )
    except Exception as error_instance:
        print(f"{get_log_timestamp()} Error calling Gemini API: {error_instance}")
        return ThoughtOutput(
            currentStep="challenge",
            empathySummary=default_empathy,
            challengeQuestion=default_challenge,
            replacementThought=default_replacement
        )
