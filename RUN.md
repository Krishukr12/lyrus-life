docker compose up -d

# LiveKit (required for live video meetings)
docker compose up livekit -d
# Verify: curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:7880/   → should print 200
# If video stays "Offline", recreate after config changes:
#   docker compose up livekit -d --force-recreate
#
# .env (must match livekit.yaml keys):
#   LIVEKIT_URL=ws://127.0.0.1:7880
#   LIVEKIT_API_KEY=devkey
#   LIVEKIT_API_SECRET=secret
# If you open the app via a LAN IP (e.g. http://192.168.x.x:8080), set:
#   LIVEKIT_PUBLIC_URL=ws://192.168.x.x:7880

# Live meeting behavior
# - Waiting room: mic/camera work before the host starts — participants can talk early
# - Host: "Start for everyone" begins the official live session; "End meeting" runs recording + MOM pipeline
# - Anyone can Leave without ending for others; host role passes to the next person if the host leaves
# - When everyone leaves, the session auto-ends after LIVE_EMPTY_ROOM_MS (default 3 seconds, set 300000 for 5 min)

# Meeting join security
# - Email "Join meeting" links go to /join/{slug} (not the dashboard).
# - User must sign in with an ALLOWED_EMAIL_DOMAINS address.
# - Only invited participants (or the host) can enter the live room.
# - Anonymous / guest join by name is disabled.

# Recordings storage (local vs private S3)
# - Default STORAGE_BACKEND=auto → S3 when AWS_S3_BUCKET is set, else ./uploads
# - Recordings are never public; download via authenticated API only
# - See docs/STORAGE.md for bucket policy, IAM, and migration

# Auth setup (first time)
# 1. Copy .env.example → .env and set JWT_SECRET, EMAIL_* for OTP mail
# 2. pnpm install
# 3. pnpm --filter @lyrus/db db:migrate
# 4. pnpm --filter @lyrus/db db:seed
# 5. Sign in at http://localhost:8080/login
#    - krishan.kumar@virtualedge.in / LyrusVirt@2026 (change at /settings after login)
#    - admin@lyrus.life / ChangeMe123!


