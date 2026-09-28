<div align="center">

  <img src="docs/socrates-voice-banner.svg" alt="Socrates Voice Architecture &amp; Cognitive Flow" width="100%" />

  <br />
  <br />

  # Socrates Voice

  <p align="center">
    <b>Platform Asisten Terapi Suara Berbasis Metodologi Cognitive Behavioral Therapy (CBT)</b>
  </p>

  <p align="center">
    <a href="#panduan-instalasi-dan-setup">Panduan Setup</a>
    &nbsp;•&nbsp;
    <a href="#panduan-penggunaan-aplikasi">Cara Penggunaan</a>
    &nbsp;•&nbsp;
    <a href="#arsitektur-dan-teknologi">Arsitektur Teknikal</a>
    &nbsp;•&nbsp;
    <a href="#dokumentasi-api">Dokumentasi API</a>
  </p>

  <br />

  <table align="center">
    <tr>
      <th align="center">Metodologi Terapi</th>
      <td align="center"><b>1. Catch</b> &nbsp;&mdash;&nbsp; <b>2. Challenge</b> &nbsp;&mdash;&nbsp; <b>3. Replace</b></td>
    </tr>
  </table>

  <br />

  <p align="center">
    <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Fastify-4.28-000000?style=flat-square&logo=fastify&logoColor=white" alt="Fastify" />
    <img src="https://img.shields.io/badge/Python-3.10%2B-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/Vite-5.3-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License MIT" />
  </p>

</div>

---

## Daftar Isi

- [Ringkasan Proyek](#ringkasan-proyek)
- [Fitur Utama](#fitur-utama)
- [Arsitektur dan Teknologi](#arsitektur-dan-teknologi)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Panduan Instalasi dan Setup](#panduan-instalasi-dan-setup)
  - [Metode A: Deployment via Docker Compose](#metode-a-deployment-via-docker-compose)
  - [Metode B: Eksekusi Manual (Development Mode)](#metode-b-eksekusi-manual-development-mode)
- [Panduan Penggunaan Aplikasi](#panduan-penggunaan-aplikasi)
- [Protokol Keselamatan Crisis Intervention](#protokol-keselamatan-crisis-intervention)
- [Dokumentasi API](#dokumentasi-api)
- [Struktur Direktori Proyek](#struktur-direktori-proyek)
- [Pengujian Sistem](#pengujian-sistem)
- [Lisensi dan Kontribusi](#lisensi-dan-kontribusi)

---

## Ringkasan Proyek

**Socrates Voice** adalah platform asisten terapi suara interaktif yang memanfaatkan prinsip-prinsip *Cognitive Behavioral Therapy* (CBT). Sistem ini membantu pengguna mengurai dan merekonstruksi pola pikir negatif secara terstruktur melalui percakapan audio real-time berbasis kecerdasan buatan dan dialog Sokratik.

Metodologi sistem berpusat pada **3 Langkah Restrukturisasi Kognitif**:

1. **Catch (Menangkap)**  
   Mengidentifikasi *Automatic Negative Thoughts* (ANTs) atau pemikiran otomatis negatif yang disampaikan pengguna dalam sesi suara.
2. **Challenge (Menantang)**  
   Membimbing pengguna mengevaluasi validitas serta distorsi kognitif dari pemikiran tersebut menggunakan pertanyaan Sokratik yang analitis.
3. **Replace (Mengganti)**  
   Membantu pengguna merumuskan sudut pandang alternatif yang objektif, konstruktif, dan rasional.

Integrasi dilakukan menggunakan **AssemblyAI Voice Agent API** (*Universal-3.5-Pro*) untuk komunikasi audio latensi rendah (*Barge-In* dan *Neural Turn Detection*), dipadukan dengan kecerdasan kognitif dari **Google Gemini API**.

---

## Fitur Utama

- **Komunikasi Audio Real-Time**: Interaksi dua arah berbasis suara secara natural dengan pengenalan jeda wicara otomatis (*Neural Turn Detection*).
- **Dukungan Interupsi (Barge-In)**: Pengguna dapat menyela pembicaraan agen AI secara langsung tanpa perlu menunggu agen selesai berbicara.
- **Alur Terapi CBT Terstruktur**: Proses 3-Langkah interaktif yang dirancang untuk membantu dekonstruksi distorsi kognitif.
- **Deteksi Krisis Real-Time (MIND-SAFE Framework)**: Pemantauan otomatis transkrip percakapan untuk mengidentifikasi potensi bahaya atau kecenderungan krisis fisik, yang akan langsung mengalihkan sistem ke modul intervensi darurat.
- **Generasi Artefak Klinis Pasca-Sesi**: Menghasilkan rekaman audio (.ogg), transkrip interaktif berstempel waktu, serta ringkasan klinis CBT yang siap digunakan untuk konsultasi dengan tenaga medis profesional.

---

## Arsitektur dan Teknologi

Platform menggunakan arsitektur microservices terdistribusi untuk memastikan pemisahan tanggung jawab yang rapi dan skalabel:

| Layer Komponen | Teknologi Utama | Peran dan Tanggung Jawab |
| :--- | :--- | :--- |
| **Frontend UI** | React, Vite, TypeScript, Tailwind CSS | Antarmuka pengguna interaktif dan pemrosesan audio browser |
| **Backend Gateway** | Node.js (v18+), Fastify, Drizzle ORM | Gateway manajemen sesi, koneksi WebSocket, dan persistensi database |
| **CBT Service** | Python (v3.10+), FastAPI | Microservice pemrosesan logika CBT dan integrasi Google Gemini API |
| **Voice Engine** | AssemblyAI Voice Agent API | Model *Universal-3.5-Pro* untuk Speech-to-Text real-time dan TTS |
| **LLM Engine** | Google Gemini API | Penalaran kognitif dan pembentukan dialog Sokratik (`gemma-4-26b`) |
| **Database** | PostgreSQL 16 | Penyimpanan data pengguna, riwayat sesi, transkrip, dan audit log |
| **Containerization** | Docker & Docker Compose | Pengemas dependensi dan eksekusi layanan multi-kontainer |

---

## Persyaratan Sistem

Pastikan perangkat atau server telah memenuhi spesifikasi minimum berikut sebelum memulai instalasi:

- **Node.js**: v18.0.0 atau versi lebih baru
- **npm**: v9.0.0 atau versi lebih baru
- **Python**: v3.10 atau versi lebih baru (`pip` dan `venv`)
- **Docker Desktop & Docker Compose**: Versi terbaru (Sangat direkomendasikan)
- **PostgreSQL**: v16 (Apabila dijalankan secara native tanpa Docker)
- **API Keys**:
  - AssemblyAI API Key
  - Google Gemini API Key

---

## Panduan Instalasi dan Setup

### 1. Kloning Repositori

Unduh kode sumber proyek melalui terminal:

```bash
git clone https://github.com/username/socrates-voice.git
cd socrates-voice
```

### 2. Konfigurasi Variable Lingkungan (`.env`)

Salin berkas [.env.example](file:///.env.example) menjadi `.env` pada root direktori:

```bash
cp .env.example .env
```

Sesuaikan parameter konfigurasi pada berkas `.env`:

```env
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

# Frontend Exposed Variables (Vite Framework)
VITE_BACKEND_SERVICE_URL=http://localhost:3455

# Inter-Service Communication Endpoints
PYTHON_SERVICE_URL=http://localhost:8080
BACKEND_SERVICE_URL=http://localhost:3455
```

---

### Metode A: Deployment via Docker Compose

Menjalankan layanan pendukung (Database PostgreSQL dan Python CBT Microservice) secara terisolasi:

```bash
docker-compose up -d --build
```

Verifikasi kesehatan layanan pendukung:
- **Python CBT Service**: `http://localhost:8080/health`
- **PostgreSQL**: `localhost:5435`

Jalankan **Fastify Backend** dan **Vite Frontend** di terminal terpisah:

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

### Metode B: Eksekusi Manual (Development Mode)

Untuk keperluan pengujian internal dan pembuatan fitur baru:

#### 1. Inisialisasi Database
Pastikan layanan PostgreSQL beroperasi pada port `5435`.

#### 2. Inisialisasi Python CBT Service
```bash
cd python-service

# Buat dan aktifkan lingkungan virtual
python -m venv venv
source venv/bin/activate  # OS Windows: venv\Scripts\activate

# Install dependensi
pip install -r requirements.txt

# Eksekusi server FastAPI
uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

#### 3. Inisialisasi Fastify Backend
```bash
cd backend

# Install paket dependensi
npm install

# Terapkan skema basis data Drizzle ORM
npx drizzle-kit push

# Eksekusi server Fastify
npm run dev
```

#### 4. Inisialisasi Vite Frontend
```bash
cd frontend

# Install dependensi UI
npm install

# Eksekusi server Vite
npm run dev
```

---

## Panduan Penggunaan Aplikasi

### Step 1: Akses Antarmuka Web
Buka peramban web dan navigasikan ke `http://localhost:3000`.

### Step 2: Memulai Sesi Suara (Step 1: Catch)
1. Tekan tombol **Start Voice Session** dan izinkan akses mikrofon browser.
2. Sampaikan keluhan atau beban pikiran yang dirasakan secara lisan.
3. Agen AI akan mengenali penghentian pembicaraan secara otomatis dan menangkap poin utama pemikiran negatif.

### Step 3: Evaluasi Sokratik (Step 2: Challenge)
1. Agen AI merespons dengan pertanyaan reflektif untuk menguji keabsahan pikiran negatif tersebut.
2. Pengguna dapat langsung menyela atau memotong penjelasan agen (*Barge-In*) jika ingin menambahkan penjelasan lisan.

### Step 4: Reframing Pemikiran (Step 3: Replace)
1. Agen AI membantu merangkum sudut pandang baru yang rasional dan seimbang berdasarkan interaksi dialog yang berlangsung.
2. Sesi diselesaikan secara formal oleh sistem.

### Step 5: Akses Artefak Sesi
Setelah sesi berakhir, pengguna dapat meninjau dan mengunduh:
- **Audio Recording**: Berkas suara utuh sesi terapi (.ogg).
- **Transcript Timeline**: Transkrip percakapan terurut berdasarkan stempel waktu.
- **CBT Clinical Summary**: Ringkasan evaluasi CBT untuk bahan konsultasi bersama profesional kesehatan jiwa.

---

## Protokol Keselamatan Crisis Intervention

Sistem Socrates Voice mengimplementasikan modul perlindungan pengguna **MIND-SAFE**:

1. **Continuous Transcript Audit**: Setiap bait kalimat dievaluasi secara real-time oleh modul `crisis_service.py`.
2. **Pengalihan Darurat**:
   - Jika terdeteksi kata kunci krisis atau potensi bahaya fisik, interaksi AI akan **dihentikan seketika**.
   - Antarmuka akan secara otomatis beralih ke moda darurat dan menampilkan kontak layanan bantuan kesehatan jiwa resmi (seperti *Hotline Kemenkes 119*).

---

## Dokumentasi API

### Fastify Backend Gateway

| Endpoint | Method | Deskripsi Fungsi |
| :--- | :--- | :--- |
| `/health` | `GET` | Memeriksa ketersediaan server Fastify |
| `/api/sessions` | `POST` | Membuka sesi terapi baru dan token AssemblyAI |
| `/api/sessions/:id` | `GET` | Mengambil data rincian sesi dan transkrip |
| `/api/cbt/process` | `POST` | Mengirim data tahapan dialog CBT |
| `/api/crisis/evaluate` | `POST` | Mengevaluasi status keselamatan teks transkrip |

### Python CBT Microservice

| Endpoint | Method | Deskripsi Fungsi |
| :--- | :--- | :--- |
| `/health` | `GET` | Memeriksa status kesehatan Python service |
| `/cbt/analyze` | `POST` | Menganalisis *Automatic Negative Thoughts* (ANTs) |
| `/cbt/challenge` | `POST` | Mengonstruksi pertanyaan reframing Sokratik |
| `/cbt/replace` | `POST` | Merumuskan alternatif sudut pandang rasional |
| `/crisis/check` | `POST` | Mengevaluasi algoritma keselamatan MIND-SAFE |

---

## Struktur Direktori Proyek

```
socrates-voice/
├── backend/                 # API Gateway Fastify & Manajemen Sesi
│   ├── src/
│   │   ├── db/              # Skema Drizzle ORM & koneksi database
│   │   ├── routes/          # Fastify route handlers (cbt, crisis, session)
│   │   └── services/        # Klien integrasi AssemblyAI & Python service
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # Antarmuka Pengguna Vite + React + Tailwind CSS
│   ├── src/
│   │   ├── components/      # Komponen UI dan antarmuka suara
│   │   ├── services/        # Manajemen koneksi WebSocket dan API
│   │   └── main.ts          # Titik masuk aplikasi frontend
│   ├── index.html
│   └── package.json
├── python-service/          # Microservice FastAPI (Logika CBT & Gemini API)
│   ├── routers/             # FastAPI Router handlers
│   ├── services/            # Modul logika CBT & integrasi Gemini LLM
│   ├── utils/               # Modul pembantu pencatatan log
│   ├── main.py              # Titik masuk server FastAPI
│   ├── requirements.txt     # Dependensi pustaka Python
│   └── Dockerfile           # Spesifikasi kontainer Docker Python
├── docs/                    # Berkas dokumentasi arsitektur
│   ├── assemblyai-integration.md # Spesifikasi integrasi AssemblyAI Realtime
│   ├── basis-topik.md       # Konsep dasar terapi CBT 3 langkah
│   ├── gemma-gemini-api-reference.md # Panduan pemanggilan Google GenAI SDK
│   ├── tech-stack.md        # Dokumen arsitektur dan spesifikasi teknologi
│   └── socrates-voice-banner.svg # Banner SVG Diagram Arsitektur
├── .env.example             # Template variabel lingkungan
├── docker-compose.yml       # Orchestration kontainer sistem
├── AGENTS.md                # Standar pengembangan software
├── DESIGN.md                # Spesifikasi sistem desain UI
└── README.md                # Dokumentasi utama proyek
```

---

## Pengujian Sistem

Prosedur verifikasi dapat dijalankan melalui perintah berikut:

```bash
# Pengujian Fastify Backend
cd backend
npm test

# Pengujian Python Microservice
cd python-service
pytest
```

---

## Lisensi dan Kontribusi

Proyek ini didistribusikan di bawah **MIT License**. Informasi lisensi secara lengkap tersedia pada berkas `LICENSE`.

Kontribusi pengembangan perangkat lunak terbuka bagi publik. Pembaruan atau perbaikan dapat disampaikan melalui *Pull Request* atau *Issue* pada repositori ini.

<div align="center">
  <p>Socrates Voice — Platform Terapi Suara Berbasis Kecerdasan Buatan dan Metodologi CBT.</p>
</div>
