# Code Reality – Gamified DSA Learning Platform

> Repair the Structured Realm. Defeat the Chaos Compiler. Code your way to Legend.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Monaco Editor, Socket.io-client |
| Backend | Node.js, Express, TypeScript, Prisma, Socket.io, Passport.js |
| Judge | Python 3.12, FastAPI, subprocess sandbox |
| Database | PostgreSQL 15 |
| Cache/Pub-Sub | Redis 7 |
| Infra | Docker Compose |

## Quick Start (Local Dev)

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- Python 3.12+

### 1. Clone & Install
```bash
git clone <your-repo>
cd code-reality
```

### 2. Configure Environment
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
# Fill in OAuth secrets, JWT secret, etc.
```

### 3. Start Everything
```bash
docker-compose up -d postgres redis
cd backend && npm install && npx prisma migrate dev && npm run dev &
cd ../judge-service && pip install -r requirements.txt && uvicorn main:app --port 8001 &
cd ../frontend && npm install && npm run dev
```

Or use Docker Compose for everything:
```bash
docker-compose up --build
```

### 4. Seed the Database
```bash
cd backend && npm run seed
```

## Services

| Service | Port |
|---|---|
| Frontend | 3000 |
| Backend API | 4000 |
| Judge Service | 8001 |
| PostgreSQL | 5432 |
| Redis | 6379 |

## Project Structure
```
code-reality/
├── frontend/          # Next.js 14 App
├── backend/           # Express REST API + WebSocket
├── judge-service/     # Python FastAPI code runner
├── shared/            # Shared TypeScript types
└── docker-compose.yml
```
