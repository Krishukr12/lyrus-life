# How transcription works (reading order)

Read these files **top → bottom** to follow one meeting recording end-to-end.

## 1. Browser: capture audio

| File | What to look for |
|------|------------------|
| `apps/web/src/hooks/use-meeting-recorder.ts` | `getUserMedia` + `MediaRecorder` → WebM blob |
| `apps/web/src/pages/MeetingDetail.tsx` | `LiveMeetingScreen`: start on join, `stopRecording()` on hang up |
| `apps/web/src/lib/api.ts` | `completeMeetingWithRecording()` → `POST /meetings/:id/complete` (multipart) |

## 2. API: receive file & run pipeline

| File | What to look for |
|------|------------------|
| `apps/api/src/routes/meetings.ts` | Route `POST /meetings/:id/complete` → saves audio → `runMeetingPipeline()` |
| `apps/api/src/services/pipeline.ts` | `runMeetingPipeline()` → calls `transcribeAudio()` → saves `Transcript` + NLU/MOM |

Also triggered from:

- `POST /meetings/:id/audio` (manual upload)
- `POST /meetings/:id/process` (re-run from latest audio)

## 3. Transcription package (provider choice)

| File | What to look for |
|------|------------------|
| `packages/transcription/src/transcribe.ts` | **`transcribeAudio()`** — `resolveProvider()` picks OpenAI → AWS → mock |
| `packages/transcription/src/transcribe-input.ts` | Input shape: `filePath`, `participants`, `meetingId` |
| `packages/transcription/src/types.ts` | `source`: `openai_whisper` \| `aws_transcribe` \| `mock` \| `notes` |
| `packages/transcription/src/aws-transcribe.ts` | S3 upload → StartTranscriptionJob → poll → parse JSON |

### Provider logic (`resolveProvider`)

```
TRANSCRIPTION_PROVIDER=auto|openai|aws|mock
  → openai if OPENAI_API_KEY
  → else aws if AWS_REGION + AWS_S3_BUCKET + credentials
  → else mock (only if file < 8KB; real recordings throw)
```

## 4. After transcript: MOM & tasks

| File | What to look for |
|------|------------------|
| `apps/api/src/services/pipeline.ts` | `persistExtraction()` after transcript saved |
| `packages/nlu/src/extract.ts` | LLM reads transcript → decisions, tasks, key points |
| `packages/db/prisma/schema.prisma` | `Transcript.source`, `TranscriptSegment` |

## 5. UI: see the result

| File | What to look for |
|------|------------------|
| `apps/api/src/lib/mappers.ts` | `transcript.source` sent to frontend |
| `apps/web/src/pages/MeetingDetail.tsx` | Transcript badge: `transcriptSourceLabel()` |

## Flow diagram

```
Join meeting → MediaRecorder (webm)
       ↓
End call → POST /meetings/:id/complete (recording + notes)
       ↓
saveUploadedAudio() → uploads/<meetingId>/...
       ↓
runMeetingPipeline()
       ↓
transcribeAudio()  ──openai──► Whisper API
                 └──aws────► S3 + Transcribe job
                 └──mock───► fake script (dev only, small files)
       ↓
prisma.transcript.upsert({ source, segments })
       ↓
extractMeetingInsights() → MOM + action items
```

## Env vars (server only — no VITE_ prefix)

```env
TRANSCRIPTION_PROVIDER=auto   # or openai | aws | mock
OPENAI_API_KEY=...
AWS_REGION=...
AWS_S3_BUCKET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

## Test without the UI

```bash
pnpm test:transcription path/to/recording.webm
```

See `scripts/test-transcription.ts`.
