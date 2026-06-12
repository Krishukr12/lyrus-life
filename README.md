# Lyrus Life — Meeting → MOM → Task Platform

AI-driven pipeline: capture meetings, transcribe audio (STT + diarization), extract action items/decisions/summaries (NLU), human-review MOM, and sync tasks.

## Monorepo layout (Turborepo + pnpm)

| Path | Purpose |
|------|---------|
| `apps/web` | React + Vite UI (meetings, MOM review, tasks, insights) |
| `apps/api` | Express REST API and processing orchestration |
| `packages/db` | Prisma schema + PostgreSQL client |
| `packages/shared` | Zod schemas and shared types |
| `packages/nlu` | LLM extraction (OpenAI + heuristic fallback) |
| `packages/transcription` | ASR (OpenAI Whisper + mock fallback) |

## Quick start

```bash
# 1. Install dependencies
pnpm install

# 2. Start Postgres (Docker Desktop must be running)
docker compose up -d
cp .env.example .env

# 3. Database
pnpm db:generate
pnpm db:push
pnpm db:seed

# 4. Run API + web
pnpm dev
```

### DATABASE_URL

Put this in the **repo root** `.env` file (same value works for local Docker):

```env
DATABASE_URL="postgresql://lyrus:lyrus@localhost:5432/lyrus_life?schema=public"
```

| Part | Value |
|------|--------|
| User | `lyrus` |
| Password | `lyrus` |
| Host | `localhost` |
| Port | `5432` |
| Database | `lyrus_life` |

If you use a hosted Postgres (Neon, Supabase, Railway), replace the whole URL with the connection string they give you, for example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/lyrus_life?sslmode=require"
```

**Common error:** `Can't reach database server at localhost:5432` means Postgres is not running. Start Docker Desktop, then run `docker compose up -d` from the project root.

### Meeting invites (email + calendar)

When you **schedule a meeting** with stakeholders, each person receives:

- An **email** with meeting details and a link to open the meeting in Lyrus Life
- A **calendar invite** (`.ics` attachment) for Outlook / Google Calendar / Apple Calendar

**Without SMTP** (local dev): invites are written to `invites/<meetingId>/` on disk and marked `logged` in the UI. Configure SMTP in `.env` for real delivery:

```env
WEB_APP_URL=http://localhost:8080
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=no-reply@yourdomain.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM="Your Company <no-reply@yourdomain.com>"
```

(`SMTP_*` variable names are also supported for backward compatibility.)

### End-to-end meeting flow

1. **Schedule** — Add stakeholders (required) → invites sent automatically  
2. **Join meeting** — Open meeting → **Join** → microphone records the session (browser `MediaRecorder`)  
3. **End meeting** — Hang up → recording + notes upload → **Whisper/AWS transcribes** → **MOM generated**  
4. **Review & approve** MOM → tasks created for assignees  

Set **`OPENAI_API_KEY`** in `.env` for real speech-to-text. Without it, only very small test files use the demo transcript; real recordings return an error until you configure OpenAI or AWS (`TRANSCRIPTION_PROVIDER`, `AWS_S3_BUCKET`, etc.).

- Web: http://localhost:8080  
- API: http://localhost:3001  
- Health: http://localhost:3001/health  

## Environment

Copy `.env.example` to `.env` at the repo root. Set `OPENAI_API_KEY` for production-quality STT and NLU; without it, the stack uses deterministic mock transcription and heuristic extraction for local development.

## API overview

| Method | Path | Description |
|--------|------|-------------|
| GET | `/meetings` | List meetings |
| POST | `/meetings` | Create meeting |
| GET | `/meetings/:id` | Meeting detail + transcript + MOM |
| PATCH | `/meetings/:id` | Update meeting |
| POST | `/meetings/:id/audio` | Upload audio → STT → NLU pipeline |
| POST | `/meetings/:id/complete` | End meeting: multipart `recording` + `notes` → pipeline |
| POST | `/meetings/:id/process` | Run pipeline from audio or notes |
| POST | `/meetings/:id/mom/generate` | Regenerate MOM from transcript/notes |
| PATCH | `/meetings/:id/mom` | Edit MOM draft |
| POST | `/meetings/:id/mom/approve` | Approve MOM and create tasks |
| GET | `/tasks` | List action items |
| GET | `/insights` | Dashboard metrics |

## Roadmap alignment

- **MVP (current):** Audio upload, STT/NLU pipeline, MOM review UI, PostgreSQL persistence, task list  
- **v1:** Google Calendar, Jira, email notifications  
- **v2:** Real-time streaming, multi-language, advanced analytics  

## Manual decisions (product)

See the design doc: API keys, consent/legal copy, retention policy, PM tool mappings, and enterprise SSO require product-owner input before production rollout.
