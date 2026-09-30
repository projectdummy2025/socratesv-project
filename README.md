<div align="center">

  <img src="docs/socrates-voice-banner.svg" alt="Socrates Voice Architecture and Cognitive Flow" width="100%" />

  # Socrates Voice

  <p align="center">
    <b>Voice-Based Cognitive Behavioral Therapy (CBT) Companion Platform</b>
  </p>

  <p align="center">
    <a href="#key-features">Features</a>
    &nbsp;&bull;&nbsp;
    <a href="#installation-and-setup-guide">Quick Start</a>
    &nbsp;&bull;&nbsp;
    <a href="#technical-architecture">Docs</a>
    &nbsp;&bull;&nbsp;
    <a href="#api-documentation">API</a>
    &nbsp;&bull;&nbsp;
    <a href="#license-and-contribution">Contributing</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/version-v1.0.0-blue.svg?style=flat-square" alt="version" />
    <img src="https://img.shields.io/badge/license-MIT-green.svg?style=flat-square" alt="license" />
    <img src="https://img.shields.io/badge/node-20_LTS-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="node" />
    <img src="https://img.shields.io/badge/Fastify-%5E4.28-000000?style=flat-square&logo=fastify&logoColor=white" alt="Fastify" />
    <img src="https://img.shields.io/badge/Python-3.10%2B-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/docker-ready-2496ED?style=flat-square&logo=docker&logoColor=white" alt="docker" />
    <img src="https://img.shields.io/badge/TypeScript-~5.5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  </p>

</div>

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technical Architecture](#technical-architecture)
- [System Requirements](#system-requirements)
- [Installation and Setup Guide](#installation-and-setup-guide)
  - [Method A: Deployment via Docker Compose](#method-a-deployment-via-docker-compose)
  - [Method B: Manual Execution (Development Mode)](#method-b-manual-execution-development-mode)
- [Application Usage Workflow](#application-usage-workflow)
- [Crisis Intervention and Safety Protocol](#crisis-intervention-and-safety-protocol)
- [API Documentation](#api-documentation)
- [Project Directory Structure](#project-directory-structure)
- [System Verification and Tests](#system-verification-and-tests)
- [License and Contribution](#license-and-contribution)

---

## Project Overview

**Socrates Voice** is an interactive, voice-first Cognitive Behavioral Therapy (CBT) assistant. The system guides users through cognitive restructuring in structured, real-time voice conversations using active listening and Socratic questioning.

The core therapy methodology follows the **3-Step Cognitive Restructuring Model**:

1. **Catch**
   Identifies Automatic Negative Thoughts (ANTs) verbalized by the user during the voice session.
2. **Challenge**
   Guides the user to evaluate validity, evidence, and cognitive distortions through analytical Socratic questioning.
3. **Replace**
   Helps the user formulate balanced, constructive, and objective alternative perspectives.

Audio streaming integrates **AssemblyAI Voice Agent API** / Web Speech API for low-latency voice capture, coupled with **Google Gemini API** for structured cognitive reasoning and context progression.

---

## Key Features

- **Real-Time Voice Interaction**: Bidirectional voice interaction with automatic turn detection and active listening.
- **Context-Aware Socratic Flow**: Preserves multi-turn session history to maintain continuity across dialogue turns.
- **Structured 3-Step CBT Workflow**: Linear progression across Catch, Challenge, and Replace therapy states.
- **Real-Time Crisis Detection (MIND-SAFE Protocol)**: Monitors transcripts for safety risks and pauses sessions immediately when crisis signals are identified.
- **Sleek Minimalist Interface**: Built with Tailwind CSS, custom waveform visualizer, and particle canvas ambiance.

---

## Technical Architecture

The platform uses a distributed microservice architecture:

| Component Layer | Core Technology | Responsibilities |
| :--- | :--- | :--- |
| **Frontend UI** | Vite, TypeScript, Tailwind CSS | Voice recording, waveform visualization, and chat timeline UI |
| **Backend Gateway** | Node.js (v18+), Fastify, Drizzle ORM | Session management gateway, database persistence, and service routing |
| **CBT Service** | Python (v3.10+), FastAPI | CBT analysis engine and Google Gemini API integration |
| **Voice Engine** | AssemblyAI / Web Speech API | Real-time speech-to-text transcription |
| **LLM Engine** | Google Gemini API | Empathetic summary and Socratic restructuring generation |
| **Database** | PostgreSQL 16 | User records, sessions, and crisis audit events |
| **Containerization** | Docker / Podman & Docker Compose | Multi-container orchestration |

---

## System Requirements

- **Node.js**: v18.0.0 or newer
- **npm**: v9.0.0 or newer
- **Python**: v3.10 or newer (`pip` and `venv`)
- **Docker / Podman with Docker Compose**: Recommended
- **PostgreSQL**: v16 (if running natively without containers)
- **API Keys**:
  - AssemblyAI API Key
  - Google Gemini API Key

---

## Installation and Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/username/socrates-voice.git
cd socrates-voice
```

### 2. Configure Environment Variables (`.env`)

Copy `.env.example` to `.env` in the root directory:

```bash
cp .env.example .env
```

Ensure configuration values match your local setup:

```env
# Services and Server Ports
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

# Frontend Exposed Variables (Vite Framework)
VITE_BACKEND_SERVICE_URL=http://localhost:3455

# Inter-Service Communication Endpoints
PYTHON_SERVICE_URL=http://localhost:8080
BACKEND_SERVICE_URL=http://localhost:3455
```

---

### Method A: Deployment via Docker Compose

Start backing services (PostgreSQL and Python CBT Microservice):

```bash
docker-compose up -d --build
```

Verify service endpoints:
- **Python CBT Service**: `http://localhost:8080/health`
- **PostgreSQL**: `localhost:5435`

Run **Fastify Backend** and **Vite Frontend** in separate terminals:

```bash
# Terminal 1: Fastify Backend
cd backend
npm install
npm run dev

# Terminal 2: Vite Frontend
cd frontend
npm install
npm run dev
```

---

### Method B: Manual Execution (Development Mode)

#### 1. PostgreSQL Database
Ensure PostgreSQL is running on port `5435`.

#### 2. Python CBT Service
```bash
cd python-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

#### 3. Fastify Backend
```bash
cd backend
npm install
npx drizzle-kit push
npm run dev
```

#### 4. Vite Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Application Usage Workflow

1. Open your browser and navigate to `http://localhost:3000`.
2. Enter display name and click **Enter Guest Session**.
3. Press **START** to initiate the voice session and allow microphone permissions.
4. Speak your feelings or thoughts in English.
5. Socrates will analyze the input, provide an empathetic validation summary, and pose a Socratic challenge question.
6. Continue speaking to explore evidence and reach a balanced replacement perspective.

---

## Crisis Intervention and Safety Protocol

Socrates Voice enforces the **MIND-SAFE** safety guidelines:

1. **Continuous Transcript Monitoring**: Transcripts are audited in real-time via `crisisService.ts` / `crisis_service.py`.
2. **Emergency Protocol**: When high-risk keywords are detected, the session is paused immediately, and international crisis helpline information (e.g., 988 Lifeline, 911/112) is presented.

---

## API Documentation

### Fastify Backend Gateway

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/health` | `GET` | Health check endpoint |
| `/api/session/create` | `POST` | Initialize new therapy session and voice token |
| `/api/cbt/analyze` | `POST` | Proxy thought analysis with conversation history |
| `/api/crisis/detect` | `POST` | Evaluate transcript text for crisis indicators |

### Python CBT Microservice

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/health` | `GET` | Microservice health check |
| `/api/cbt/analyze` | `POST` | Generate empathetic summary and Socratic restructuring |
| `/api/crisis/classify` | `POST` | Classify risk level for emergency routing |

---

## Project Directory Structure

```
socrates-voice/
├── backend/                 # Fastify API Gateway & Session Management
│   ├── src/
│   │   ├── db/              # Drizzle ORM schema & database client
│   │   ├── routes/          # Fastify route handlers (cbt, crisis, session)
│   │   └── services/        # AssemblyAI and crisis analysis services
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # Vite + TypeScript + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/      # UI components (Header, Dock, CrisisModal, Chat)
│   │   ├── services/        # Audio streaming, auth, and API client
│   │   └── main.ts          # Main application entry point
│   ├── index.html
│   └── package.json
├── python-service/          # FastAPI Microservice (CBT Logic & Gemini LLM)
│   ├── routers/             # FastAPI route controllers
│   ├── services/            # CBT processing & crisis classification
│   ├── utils/               # Structured logging utility
│   ├── schemas.py           # Pydantic data schemas
│   ├── main.py              # FastAPI application entry
│   ├── requirements.txt     # Python package requirements
│   └── Dockerfile           # Python service container definition
├── docs/                    # Architecture and integration specifications
├── .env.example             # Environment variables template
├── docker-compose.yml       # Container orchestration specification
├── AGENTS.md                # Development standards contract
└── README.md                # Main project documentation
```

---

## System Verification and Tests

Run verification checks with:

```bash
# Backend TypeScript Typecheck & Build
cd backend
npm run build

# Frontend Typecheck & Build
cd frontend
npm run build
```

---

## License and Contribution

Distributed under the **MIT License**. See `LICENSE` for details.
