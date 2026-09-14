# PRD Stack — Socrates-Voice

## 1. Project Vision

Socrates-Voice is a CBT-based voice therapy assistant. It guides users through 3 cognitive restructuring steps: Catch, Challenge, Replace.

## 2. Technical Stack

### 2.1 Core
- Language: TypeScript
- Runtime: Node.js 18+
- Frontend: Vite + vanilla TypeScript + Tailwind CSS
- Backend: Fastify (TypeScript)
- CBT Logic Service: Python (FastAPI or stdlib HTTP server)
- State: Browser localStorage / sessionStorage + server state via Fastify + Python service

### 2.2 AI/ML Services
- **AssemblyAI Voice Agent API** — main conversational engine
  - Model: `universal-3-5-pro`
  - Features: barge-in, neural turn detection
- **AssemblyAI Realtime STT** — fallback/enhanced transcription
- **Gemini API** — LLM for CBT reasoning (`gemma-4-26b-a4b-it` or `gemma-4-31b-it`)

### 2.3 Infrastructure
- Hosting: 
  - Frontend: Vite (Static host / Vercel / Cloudflare Pages)
  - Node Backend: Fastify (Render / Railway / VPS)
  - Python Microservice: FastAPI / Flask (Render / Railway / Docker Container)
- Database: PostgreSQL (Local / Docker)
- Auth: Simplified guest auth / local session
- Storage: S3-compatible for session recordings

## 3. Data Models

```typescript
interface User {
  id: string;
  email: string;
  createdAt: Date;
}

interface Session {
  id: string;
  userId: string;
  agentId: string;
  status: "active" | "completed" | "failed";
  startedAt: Date;
  endedAt?: Date;
  durationSeconds?: number;
}

interface TranscriptTurn {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

interface CBTStep {
  id: string;
  sessionId: string;
  step: "catch" | "challenge" | "replace";
  userInput: string;
  agentResponse: string;
  timestamp: Date;
}
```

## 4. API Integrations

### 4.1 AssemblyAI Voice Agent
- Create agent: `POST https://api.assemblyai.com/v2/agents`
- Create session: `POST https://api.assemblyai.com/v2/agents/{agent_id}/sessions`
- WebSocket URL from session response
- List sessions: `GET https://agents.assemblyai.com/v1/sessions`
- Get artifacts: `GET https://agents.assemblyai.com/v1/sessions/{session_id}`
- Audio download: S3 presigned URL (no auth header)

### 4.2 AssemblyAI Realtime STT
- Token: `GET https://streaming.assemblyai.com/v3/token?expires_in_seconds=300`
- Header: `Authorization: <ASSEMBLYAI_API_KEY>`
- WebSocket: `wss://streaming.assemblyai.com/v3/ws?token=<token>&sample_rate=16000&encoding=pcm_s16le`
- Audio Format: Raw PCM 16-bit 16kHz Little-Endian Int16 via Web Audio API (`AudioContext`)
- Model: `universal-3-5-pro` (English `en-US`) / Web Speech API (`id-ID` for Indonesian)

### 4.3 Gemini API
- Client: `@google/genai` or REST `https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent`
- Use for CBT reasoning, not for voice orchestration

## 5. Core Flows

### 5.1 Voice Session Flow
1. User opens app → auth check
2. Frontend requests session from backend 
3. Backend creates AssemblyAI agent session
4. Frontend connects WebSocket with temp token
5. User speaks → AssemblyAI transcribes + agent responds
6. Backend stores turns to DB
7. Session ends → artifacts downloaded → saved to storage

### 5.2 CBT Flow
1. **Catch**: User states automatic negative thought
2. **Challenge**: Agent asks Socratic questions
3. **Replace**: Agent suggests balanced alternative

### 5.3 Session Output
Every completed session produces shareable artifacts:

- **Audio recording** — full session in OGG/Opus
- **Transcript timeline** — JSON with user/agent turns and timestamps
- **CBT session report** — structured summary for psychologist review:
  - Automatic negative thought (Catch)
  - Socratic challenge responses (Challenge)
  - Balanced replacement thought (Replace)
  - Crisis flags if any
  - Session duration and timestamp

This report is the primary deliverable users bring to their therapist.

### 5.4 Crisis Detection
- Monitor transcripts for danger keywords
- If detected: pause agent, show crisis resources, log event

## 6. Implementation Phases

### Phase 1: MVP
- [ ] Vite + vanilla TypeScript frontend scaffold
- [ ] Fastify backend scaffold
- [ ] Auth flow (Supabase Auth or custom JWT)
- [ ] AssemblyAI Voice Agent basic integration
- [ ] CBT prompt template
- [ ] Session listing + transcript playback
- [ ] Basic crisis keywords filter

### Phase 2: Polish
- [ ] Turn detection tuning
- [ ] Barge-in UX
- [ ] Multi-language support
- [ ] Session analytics dashboard
- [ ] Error boundaries + retry logic

### Phase 3: Scale
- [ ] RAG over CBT techniques
- [ ] User progress tracking
- [ ] Admin dashboard

## 7. AI Coding Constraints

From project `AGENTS.md`:
- No god functions/components >150 lines
- Flat control flow, max 3 nesting levels
- No magic values; use named constants
- Pure business logic in separate functions
- TypeScript strict mode, no `any`
- Tailwind CSS only, no custom CSS unless necessary
- Test every feature
- Follow AssemblyAI official docs: `https://www.assemblyai.com/docs/agent-instructions.md` + `https://www.assemblyai.com/docs/llms.txt`

## 8. Alignment with Basis Topik

Dokumen ini disusun agar AI CLI bisa mengeksekusi [basis-topik.md](file:///home/ahmad/projects/socrates-voice/docs/basis-topik.md)

### 8.1 CBT 3 Langkah → Data Models & Flows
- **Catch** → `TranscriptTurn` untuk merekam pikiran otomatis negatif
- **Challenge** → `CBTStep.step === "challenge"` untuk dialog Socratic
- **Replace** → `CBTStep.step === "replace"` untuk alternatif seimbang

### 8.2 AssemblyAI Voice Agent API → API Integrations
- Dialog <1 detik: pakai AssemblyAI Voice Agent dengan model `universal-3-5-pro`
- **Barge-in**: on by default dalam Voice Agent; jangan blokir audio input saat agent bicara
- **Neural Turn Detection**: aktifkan via config agar pengguna selesai bicara tanpa jeda kaku

### 8.3 MIND-SAFE Framework → Risks & Mitigations
- **RAG**: Phase 3 tambah retrieval CBT techniques sebelum generate response
- **Crisis Detection**:
  - Input layer: keyword filter + LLM classification
  - Jika terdeteksi: pause agent, tampilkan resources, log event
  - Wajib ada di MVP, bukan opsional

### 8.4 Follow Official Docs
- Semua kode harus mengikuti:
  - `https://www.assemblyai.com/docs/agent-instructions.md`
  - `https://www.assemblyai.com/docs/llms.txt`
  - Jangan gunakan parameter names dari memori; refetch dulu sebelum coding.

## 8. Environment Variables

```bash
# AssemblyAI
ASSEMBLYAI_API_KEY=<key>

# Gemini
GEMINI_API_KEY=<key>

# Database
DATABASE_URL=<postgres-connection-string>

# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<key>
CLERK_SECRET_KEY=<key>

# Storage
S3_BUCKET=<bucket>
S3_REGION=<region>
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<key>


```

## 9. API Routes (Planned)

```
POST   /api/session/create        Create AssemblyAI voice session
GET    /api/session/list          List user sessions
GET    /api/session/:id           Get session artifacts
POST   /api/session/end           End active session
POST   /api/cbt/analyze           Analyze thought (Gemini)
POST   /api/crisis/detect         Crisis keyword detection
```

## 10. Risks & Mitigations

- **Latency**: Use Edge runtime, minimize prompt size
- **Audio quality**: Enforce PCM 16kHz mono, handle noise
- **Crisis misses**: Multi-layer keyword + LLM classification
- **Cost**: Track session duration, enforce timeouts
