# syntax=docker/dockerfile:1

# Meeting Desk AI — API production image (linux/amd64 for EC2)
# Build: docker buildx build --platform linux/amd64 -t meetingdesk-api:latest .
# Run:   docker run --env-file /opt/meetingdesk/backend/.env -p 3000:3000 meetingdesk-api:latest

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# --- Prune monorepo to api dependency graph ---
FROM base AS prepare
COPY . .
RUN pnpm dlx turbo@^2.9.6 prune api --docker

# --- Install dependencies ---
FROM base AS deps
COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=prepare /app/scripts/check-node-version.mjs scripts/check-node-version.mjs
RUN pnpm install

# --- Build ---
FROM base AS builder
COPY --from=deps /app/ .
COPY --from=prepare /app/out/full/ .
COPY scripts/patch-package-exports.mjs scripts/patch-package-exports.mjs

# Prisma generate requires DATABASE_URL at config load time; no DB connection is made.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build?schema=public"

RUN pnpm --filter @lyrus/shared build && \
    pnpm --filter @lyrus/auth build && \
    pnpm --filter @lyrus/mom-pdf build && \
    pnpm --filter @lyrus/nlu build && \
    pnpm --filter @lyrus/transcription build && \
    pnpm --filter @lyrus/notifications build && \
    pnpm --filter @lyrus/db build && \
    pnpm --filter api build
RUN node scripts/patch-package-exports.mjs
RUN CI=true pnpm prune --prod

# --- Production runtime ---
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app

RUN addgroup -g 1001 -S app && adduser -u 1001 -S app -G app

COPY --from=builder --chown=app:app /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/apps/api ./apps/api
COPY --from=builder --chown=app:app /app/packages/auth ./packages/auth
COPY --from=builder --chown=app:app /app/packages/db ./packages/db
COPY --from=builder --chown=app:app /app/packages/shared ./packages/shared
COPY --from=builder --chown=app:app /app/packages/mom-pdf ./packages/mom-pdf
COPY --from=builder --chown=app:app /app/packages/nlu ./packages/nlu
COPY --from=builder --chown=app:app /app/packages/notifications ./packages/notifications
COPY --from=builder --chown=app:app /app/packages/transcription ./packages/transcription

USER app
WORKDIR /app/apps/api
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "dist/index.js"]
