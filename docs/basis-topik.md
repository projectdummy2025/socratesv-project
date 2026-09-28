# Topic Basis & Conceptual Framework — Socrates-Voice

## 1. Vision & Core Concept

**Socrates-Voice** is an interactive voice therapy companion based on **Cognitive Behavioral Therapy (CBT) Cognitive Restructuring**. The system is designed to listen, summarize, and guide users experiencing mental fatigue or emotional distress through warm, structured spoken dialogue.

---

## 2. 3-Step CBT Methodology (Cognitive Restructuring)

The system guides users through deconstructing cognitive distortions via 3 sequential stages:

| CBT Stage | Stage Name | Description & Agent Role | Example Interaction |
| :--- | :--- | :--- | :--- |
| **Step 1** | **Catch** | Empathetically listens, summarizes the user's emotional state, and identifies the *Automatic Negative Thought (ANT)*. | *"I hear how exhausted you feel because it seems like you have to carry the entire workload alone."* |
| **Step 2** | **Challenge** | Asks gentle Socratic reflective questions to evaluate facts vs. perceptions without judgment. | *"Is there concrete evidence showing you must finish everything yourself without asking for help?"* |
| **Step 3** | **Replace** | Guides the user to formulate a balanced, rational, and soothing alternative perspective. | *"Let's consider this perspective: You deserve rest and have the right to ask for support when the burden exceeds your limit."* |

---

## 3. Empathy & Active Listening Principles (Summarization)

To ensure conversation feels natural, warm, and empathetic:
1. **Emotional Validation First**: Before offering reflective questions, the agent must summarize and validate the user's feelings first (*Active Listening*).
2. **Multi-Turn Conversation Memory**: The agent retains user statements across the venting session to maintain contextually consistent dialogue.
3. **Calming & Supportive Responses**: The agent speaks with a calm, friendly tone without sounding preachy or transactional.

---

## 4. Real-Time Voice Interaction Technology

The system leverages modern audio technology to deliver an intuitive venting experience:

- **Low-Latency Voice Streaming**: High-speed speech recognition via WebSocket token streaming.
- **Interruption Support (*Barge-In*)**: Users can interrupt the agent at any point while expressing intense emotions.
- **Pause & Turn Detection (*Neural Turn Detection*)**: The agent intelligently detects natural speech pauses without unnatural delays.

---

## 5. MIND-SAFE Safety Framework (*Crisis Intervention*)

As a responsible emotional companion:
- **Input Crisis Detection**: Real-time monitoring of dangerous keywords (physical self-harm or extreme distress triggers).
- **Automated Pause & Redirect**: If crisis indicators are flagged, the agent immediately pauses the session and displays official helpline resources (*e.g., 119 Mental Health Helpline*).
