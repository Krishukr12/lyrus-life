#!/usr/bin/env bash
set -euo pipefail

# Deploy Meeting Desk AI API from ECR to this EC2 host.
#
# Usage:
#   ./scripts/deploy-api.sh
#   ECR_IMAGE=123456789.dkr.ecr.us-east-1.amazonaws.com/meetingdesk-api:latest ./scripts/deploy-api.sh
#
# Prerequisites on EC2:
#   - Docker installed
#   - AWS CLI configured (or instance role with ECR pull access)
#   - Production env file at /opt/meetingdesk/backend/.env

CONTAINER_NAME="${CONTAINER_NAME:-meetingdesk-api}"
ENV_FILE="${ENV_FILE:-/opt/meetingdesk/backend/.env}"
HOST_PORT="${HOST_PORT:-3000}"
CONTAINER_PORT="${CONTAINER_PORT:-3000}"
ECR_REGION="${ECR_REGION:-${AWS_REGION:-us-east-1}}"
ECR_IMAGE="${ECR_IMAGE:?Set ECR_IMAGE to your ECR repository URI (e.g. 123456789.dkr.ecr.us-east-1.amazonaws.com/meetingdesk-api:latest)}"

log() {
  printf '\n==> %s\n' "$*"
}

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: env file not found: $ENV_FILE" >&2
  exit 1
fi

log "Logging in to ECR ($ECR_REGION)"
aws ecr get-login-password --region "$ECR_REGION" | docker login --username AWS --password-stdin "${ECR_IMAGE%%/*}"

log "Pulling $ECR_IMAGE"
docker pull "$ECR_IMAGE"

log "Stopping existing container (if any)"
docker stop "$CONTAINER_NAME" 2>/dev/null || true
docker rm "$CONTAINER_NAME" 2>/dev/null || true

log "Starting $CONTAINER_NAME"
docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  --env-file "$ENV_FILE" \
  -e NODE_ENV=production \
  -p "${HOST_PORT}:${CONTAINER_PORT}" \
  "$ECR_IMAGE"

log "Running containers"
docker ps --filter "name=$CONTAINER_NAME"

log "Recent logs"
docker logs --tail 50 "$CONTAINER_NAME"

log "Health check"
sleep 3
curl -sf "http://127.0.0.1:${HOST_PORT}/health" && echo || {
  echo "WARNING: health check failed — inspect logs with: docker logs -f $CONTAINER_NAME" >&2
  exit 1
}

log "Deploy complete"
