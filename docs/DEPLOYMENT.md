# Backend API — Production Deployment

Deploy the Meeting Desk AI API as a Docker container on EC2, pulling images from AWS ECR.

## Architecture

```
Developer machine / CI
  └─ docker buildx build --platform linux/amd64
  └─ docker push → AWS ECR

EC2 (Ubuntu)
  └─ scripts/deploy-api.sh
       ├─ ECR login
       ├─ docker pull
       ├─ docker stop / rm (old container)
       └─ docker run --env-file /opt/meetingdesk/backend/.env
```

Secrets live **only** on the EC2 host in `/opt/meetingdesk/backend/.env`. They are never baked into the Docker image.

## Prerequisites

| Requirement | Notes |
|---|---|
| Node 22.12+ | Local builds use Docker; host Node version does not matter |
| Docker + buildx | For local image builds |
| AWS ECR repository | e.g. `meetingdesk-api` |
| EC2 instance | x86_64 (amd64) recommended |
| RDS PostgreSQL | `DATABASE_URL` with `?sslmode=require` for RDS |

## Build & Push Image

From the **monorepo root**:

```bash
# Local build (Apple Silicon → EC2 amd64)
docker buildx build \
  --platform linux/amd64 \
  -t meetingdesk-api:latest \
  .

# Tag and push to ECR
AWS_ACCOUNT_ID=123456789012
AWS_REGION=us-east-1
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/meetingdesk-api"

aws ecr get-login-password --region "$AWS_REGION" | \
  docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

docker tag meetingdesk-api:latest "${ECR_URI}:latest"
docker push "${ECR_URI}:latest"
```

## EC2 Setup (one-time)

```bash
# Install Docker on Ubuntu
sudo apt-get update
sudo apt-get install -y docker.io awscli curl
sudo usermod -aG docker "$USER"

# Create env file directory
sudo mkdir -p /opt/meetingdesk/backend
sudo chown "$USER:$USER" /opt/meetingdesk/backend

# Copy and edit production env (see Required Environment Variables below)
nano /opt/meetingdesk/backend/.env
```

## Deploy

Copy `scripts/deploy-api.sh` to the EC2 host, then:

```bash
chmod +x deploy-api.sh

ECR_IMAGE=123456789012.dkr.ecr.us-east-1.amazonaws.com/meetingdesk-api:latest \
  ./deploy-api.sh
```

The script performs: ECR login → pull → stop old container → run new container → show logs → health check.

### Manual deploy (equivalent)

```bash
docker pull <ecr-image>

docker stop meetingdesk-api || true
docker rm meetingdesk-api || true

docker run -d \
  --name meetingdesk-api \
  --restart unless-stopped \
  --env-file /opt/meetingdesk/backend/.env \
  -e NODE_ENV=production \
  -p 3000:3000 \
  <ecr-image>
```

## Required Environment Variables

These **must** be set in `/opt/meetingdesk/backend/.env`. The container fails fast with a clear error if they are missing in production.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | **Yes** | PostgreSQL connection string (use `?sslmode=require` for RDS) |
| `JWT_SECRET` | **Yes** | At least 32 characters |
| `NODE_ENV` | Recommended | Set to `production` (deploy script sets this) |
| `PORT` | Optional | Container listen port (default `3000`) |
| `API_HOST` | Optional | Bind address (default `0.0.0.0`) |
| `CORS_ORIGIN` | Recommended | Comma-separated allowed origins for your web app |
| `WEB_APP_URL` | Recommended | Public URL of the organization portal |
| `API_PUBLIC_URL` | Recommended | Public URL of this API (OAuth callbacks, webhooks) |

### Common optional variables

| Variable | Purpose |
|---|---|
| `STORAGE_BACKEND` | `auto`, `local`, or `s3` |
| `AWS_REGION`, `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | S3 recording storage |
| `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` | Live meetings |
| `OPENAI_API_KEY` | Transcription / NLU |
| `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` | SMTP |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google Calendar integration |
| `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET` | Microsoft integration |
| `RECALL_API_KEY` | Recording bot for external platforms |

See [.env.example](../.env.example) for the full list with defaults.

## Database Migrations

Run migrations **before** or **during** first deploy (not inside the container startup):

```bash
# From a machine with repo access and DATABASE_URL set
pnpm db:migrate:deploy
```

## Rollback

```bash
# List available tags in ECR
aws ecr describe-images \
  --repository-name meetingdesk-api \
  --query 'sort_by(imageDetails,& imagePushedAt)[*].imageTags' \
  --output table

# Deploy a previous tag
ECR_IMAGE=123456789012.dkr.ecr.us-east-1.amazonaws.com/meetingdesk-api:<previous-tag> \
  ./deploy-api.sh
```

Or re-run with a locally tagged previous image if you saved it:

```bash
docker images meetingdesk-api
ECR_IMAGE=meetingdesk-api:<previous-sha> ./deploy-api.sh
```

## Verification Checklist

After deploy, confirm:

- [ ] `docker ps` shows `meetingdesk-api` running
- [ ] `curl http://localhost:3000/health` returns `{"status":"ok"}`
- [ ] `docker logs meetingdesk-api` shows `API listening on http://0.0.0.0:3000`
- [ ] No Prisma / `DATABASE_URL` errors in logs
- [ ] Auth endpoint responds (e.g. `GET /health` → 200)
- [ ] Container restarts after `docker restart meetingdesk-api`
- [ ] `docker stop meetingdesk-api` triggers graceful shutdown (SIGTERM)

## Local Docker Verification

```bash
# Build
docker buildx build --platform linux/amd64 -t meetingdesk-api:latest .

# Run with local postgres (docker compose up -d postgres)
cp .env.example .env.local-test
# Edit DATABASE_URL to reach host postgres from container:
#   postgresql://lyrus:lyrus@host.docker.internal:5432/lyrus_life?schema=public

docker run --rm \
  --env-file .env.local-test \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -p 3000:3000 \
  meetingdesk-api:latest

curl http://localhost:3000/health
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| `exec format error` on EC2 | Rebuild with `--platform linux/amd64` |
| `JWT_SECRET must be set` | Add `JWT_SECRET` (≥32 chars) to `.env` |
| `DATABASE_URL is not set` | Add `DATABASE_URL` to `.env` |
| Prisma connection timeout | Check RDS security group allows EC2 |
| `Can't reach database` from container | Use RDS endpoint, not `localhost` |

## Image Details

- **Base**: `node:22-alpine`
- **User**: non-root `app` (uid 1001)
- **Port**: `3000` (configurable via `PORT`)
- **Health**: `GET /health` → `{"status":"ok"}`
- **Start command**: `node dist/index.js`
- **Build**: Turbo prune → pnpm install → turbo build → patch workspace exports → production prune
