import os
import json
from typing import List
from google import genai
from google.genai import types
from utils.logger import get_log_timestamp
from schemas import ChatMessage, ThoughtOutput

# System prompt for empathetic CBT Socratic questioning and active listening in natural English
CBT_SYSTEM_PROMPT = (
    "You are Socrates, a warm, highly empathetic, and fluid Cognitive Behavioral Therapy (CBT) practitioner. "
    "Your dialogue must be natural, conversational, soothing, and human in English—never sound like a rigid query chatbot or a template. "
    "1. Empathy & Active Listening (empathySummary): Validate the user's emotion warmly and acknowledge their experience naturally. "
    "2. Socratic Exploration (challengeQuestion): Ask ONE gentle, insightful reflective question that invites them to examine their thought. "
    "3. Balanced Perspective (replacementThought): Offer ONE comforting, grounded alternative perspective that brings peace of mind."
)

# Global cached GenAI client instance to eliminate per-request SSL/TLS initialization overhead
_cached_genai_client: genai.Client | None = None

def get_genai_client() -> genai.Client | None:
    global _cached_genai_client
    if _cached_genai_client is not None:
        return _cached_genai_client

    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        print(f"{get_log_timestamp()} Warning: GEMINI_API_KEY environment variable not set")
        return None
    try:
        _cached_genai_client = genai.Client(api_key=api_key)
        return _cached_genai_client
    except Exception as init_error:
        print(f"{get_log_timestamp()} Failed initializing GenAI client: {init_error}")
        return None

# Format conversation turns into prompt context string
def format_conversation_context(thoughtText: str, historyTurns: List[ChatMessage]) -> str:
    past_turns = [t for t in historyTurns if not (t.role == "user" and t.content == thoughtText)]
    if not past_turns:
        return f"User expressed: {thoughtText}"

    formatted_turns = []
    for turn in past_turns[-6:]:
        speaker = "User" if turn.role == "user" else "Socrates"
        formatted_turns.append(f"{speaker}: {turn.content}")

    history_block = "\n".join(formatted_turns)
    return f"Previous conversation history:\n{history_block}\n\nLatest user thought: {thoughtText}"

# Process negative thought using CBT Socratic reasoning framework
def process_cbt_thought(thoughtText: str, conversationHistory: List[ChatMessage] = []) -> ThoughtOutput:
    print(f"{get_log_timestamp()} Processing CBT thought restructuring with context")
    genai_client = get_genai_client()

    default_empathy = f"I hear how heavy and exhausting this situation feels for you right now."
    default_challenge = f"When this thought comes up, is there another perspective that might bring you some peace of mind?"
    default_replacement = "You are doing your best, and it is completely okay to take things one gentle step at a time."

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
