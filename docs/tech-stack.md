# Technical Stack & Architecture — Socrates-Voice

## 1. Overview & Architecture

Socrates-Voice is a distributed microservices platform designed for real-time Cognitive Behavioral Therapy (CBT) voice interaction.

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Vite + TS)                    │
│      - Web Audio API (PCM 16kHz Streaming)                  │
│      - Local Session State & Waveform Visualizer           │
└──────────────┬──────────────────────────────┬───────────────┘
               │ HTTP API                     │ WebSocket
               ▼                              ▼
┌──────────────────────────────┐   ┌──────────────────────────┐
│  Backend Gateway (Fastify)   │   │ AssemblyAI Realtime API  │
│  - Session Management        │   │ - Speech-to-Text         │
│  - Drizzle ORM (PostgreSQL)  │   │ - Realtime Token Auth    │
└──────────────┬───────────────┘   └──────────────────────────┘
               │ HTTP Proxy
               ▼
┌──────────────────────────────┐
│  Python Microservice         │
│  - FastAPI Framework         │
│  - Google GenAI SDK (Gemini) │
└──────────────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Core Stack
- **Frontend**: Vite + Vanilla TypeScript + Tailwind CSS
- **Backend API Gateway**: Fastify (Node.js 18+ TypeScript)
- **CBT Reasoning Microservice**: Python 3.11+ (FastAPI + Uvicorn)
- **Database**: PostgreSQL 16 + Drizzle ORM
- **Containerization**: Podman / Docker & Docker Compose

### 2.2 External AI/ML Services
- **AssemblyAI Realtime STT**: Real-time speech recognition via WebSocket PCM streaming (`universal-3-5-pro` / Web Speech API `id-ID` fallback).
- **Google Gemini API**: Socratic reasoning & CBT cognitive restructuring (`google-genai` Python SDK).

---

## 3. Data Schema & Core Endpoints

### 3.1 Data Schema (Drizzle ORM)
```typescript
interface User {
  id: string;
  userEmail: string;
  createdAt: Date;
}

interface Session {
  id: string;
  userId: string;
  agentId: string;
  sessionStatus: "active" | "completed" | "failed";
  startedAt: Date;
}

interface CrisisEvent {
  id: string;
  sessionId: string;
  riskLevel: string;
  triggerPhrase: string;
  createdAt: Date;
}
```

### 3.2 API Route Registry
```
POST /api/session/create    Create AssemblyAI voice session and WebSocket token
POST /api/cbt/analyze       Analyze negative thought and return Socratic questions
POST /api/crisis/detect     Evaluate transcript for safety & crisis triggers
GET  /health                Health check endpoint
```

---

## 4. Environment Variables Specification

```bash
# Services & Server Ports
PORT_FRONTEND=3000
PORT_BACKEND=3455
PORT_PYTHON=8080
PORT_POSTGRES=5435

# PostgreSQL Database Configuration
POSTGRES_USER=socrates_user
POSTGRES_PASSWORD=socrates_secure_password
POSTGRES_DB=socrates_db
DATABASE_URL=postgresql://socrates_user:socrates_secure_password@localhost:5435/socrates_db

# External Service API Keys
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Endpoints
VITE_BACKEND_SERVICE_URL=http://localhost:3455
PYTHON_SERVICE_URL=http://localhost:8080
BACKEND_SERVICE_URL=http://localhost:3455
```
