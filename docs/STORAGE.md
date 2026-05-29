# Meeting recording storage

## Why there was a local `uploads/` folder

Early MVP flow: the browser posts the WebM to the API, the API writes files under `UPLOAD_DIR` (default `./uploads`), then transcription reads that path. That is simple for local dev and needs no AWS account.

**Recordings were never meant to be public.** The API does not expose `/uploads` as static files. Only authenticated routes can process or download audio.

When `TRANSCRIPTION_PROVIDER=aws`, AWS Transcribe still needed the file in S3, so the old code uploaded **again** from disk to S3 — duplicate storage and an extra copy step.

## How it works now

| `STORAGE_BACKEND` | Behavior |
|-------------------|----------|
| `local` | Save under `UPLOAD_DIR` (dev / air-gapped) |
| `s3` | Save to private S3 only (requires AWS env) |
| `auto` (default) | **S3 if AWS is configured**, otherwise local |

Each row in `AudioFile` stores `storageBackend` (`LOCAL` or `S3`) so re-processing works after you switch modes.

### Security (S3)

- Objects use **SSE-S3** (`AES256`).
- **No public ACL** and no public bucket policy — use **Block all public access** on the bucket.
- Browsers never get a permanent object URL. For playback/download use:
  - `GET /meetings/:id/recording/download` (JWT required)
  - S3: short-lived **presigned URL** (default 15 minutes, `RECORDING_PRESIGN_SECONDS`)
  - Local: authenticated **stream** from the API (still not world-readable)

### AWS Transcribe

If the recording is already in the same bucket, transcription reuses the existing key (no second upload).

## Environment variables

```env
# local disk (when STORAGE_BACKEND=local or auto without AWS)
UPLOAD_DIR=./uploads

# storage mode: auto | local | s3
STORAGE_BACKEND=auto

# S3 (required for s3, or for auto in production)
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-private-bucket
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
# Optional key prefix (default: recordings)
AWS_S3_PREFIX=recordings

# Presigned download TTL (seconds)
RECORDING_PRESIGN_SECONDS=900
```

Your `.env` already sets `TRANSCRIPTION_PROVIDER=aws` and `AWS_S3_BUCKET` — with `STORAGE_BACKEND=auto`, **new recordings go straight to S3**.

## S3 bucket checklist (AWS Console)

1. Create a bucket (e.g. `lyrus-life-recordings`).
2. **Block all public access** — ON.
3. **Object Ownership** — Bucket owner enforced (recommended).
4. **Default encryption** — SSE-S3 or SSE-KMS.
5. IAM policy for the API user — minimal example:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::your-private-bucket/recordings/*"
    }
  ]
}
```

6. For AWS Transcribe, the same role/user also needs `transcribe:StartTranscriptionJob`, `transcribe:GetTranscriptionJob`, and read access to the bucket (see [AWS Transcribe docs](https://docs.aws.amazon.com/transcribe/latest/dg/how-input.html)).

7. Optional lifecycle rule: transition or delete objects after N days for cost/compliance.

## Apply DB migration

```bash
pnpm --filter @lyrus/db exec prisma migrate deploy
pnpm --filter @lyrus/db exec prisma generate
```

## Local dev vs production

| Environment | Suggested config |
|-------------|------------------|
| Laptop, no AWS | `STORAGE_BACKEND=local`, `OPENAI_API_KEY` for Whisper |
| Laptop, with AWS | `STORAGE_BACKEND=auto` (uses S3 when bucket is set) |
| Production | `STORAGE_BACKEND=s3`, private bucket, no `UPLOAD_DIR` on ephemeral disks |

## Migrating existing `uploads/` files

Old files stay on disk with `storageBackend=LOCAL`. Re-run `POST /meetings/:id/process` after migration, or upload again from the meeting UI. To move to S3 in bulk, use `aws s3 sync ./uploads s3://your-bucket/recordings/` and update `AudioFile` rows (or re-upload once per meeting).

## Download API (for a future “play recording” UI)

```http
GET /meetings/:id/recording/download
Authorization: Bearer <token>
```

Response:

- **S3:** `{ "mode": "presigned", "url": "https://...", "expiresInSeconds": 900 }`
- **Local:** streamed `audio/webm` body

Do not store presigned URLs in the database or share them in email.
