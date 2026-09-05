# AssemblyAI Voice Agent API — Core Spec

Source: https://www.assemblyai.com/docs/voice-agents/voice-agent-api.md

## 1. Quick Definition (`agents/minimal.jsonc`)
```json
{
  "name": "Socrates Voice Agent",
  "system_prompt": "You are a CBT voice therapist. Guide user through Catch, Challenge, Replace.",
  "voice": { "voice_id": "anna" },
  "greeting": "Hello, I am Socrates. What thought is troubling you?"
}
```

## 2. Deploy
- **Browser (Port 3000)**: `python deployment/browser/server.py` or `npm start`
- **Phone (Twilio SIP)**: `python deployment/telephony/connect.py` or `npm run phone`

## 3. Retriving Recordings & Transcripts

1. **List Sessions**:
```http
GET https://agents.assemblyai.com/v1/sessions?limit=5
H "Authorization: $ASSEMBLYAI_API_KEY"
```

2. **Get Session Details & Download Links**:
```http
GET https://agents.assemblyai.com/v1/sessions/{session_id}
H "Authorization: $ASSEMBLYAI_API_KEY"
```

Response:
```json
{
  "id": "sess_12345",
  "status": "completed",
  "artifacts": [
    { "type": "audio", "url": "https://s3...", "content_type": "audio/ogg" },
    { "type": "timeline", "url": "https://s3...", "content_type": "application/json" }
  ]
}
```
*Note*: Download directly from `url` without `Authorization` header. Pre-signed URLs expire quickly.
