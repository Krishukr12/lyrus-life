docker compose up -d

## Node.js (required)

Prisma 7 needs **Node 20.19+, 22.12+, or 24.0+**. **Node 23 is not supported.**

```bash
node -v   # must NOT be v23.x

# Option A — nvm (recommended; see .nvmrc)
nvm install
nvm use

# Option B — Homebrew node@22 (already installed on this machine)
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
node -v   # should show v22.12+

pnpm install
```

## Multi-tenant setup

```bash
pnpm db:generate
pnpm db:pre-migrate   # existing DBs only
pnpm db:push:force
pnpm db:seed
pnpm dev              # starts api + web + admin via turbo
```

**Database:** For local Postgres, run `docker compose up -d` and use the `DATABASE_URL` from `.env.example`. For AWS RDS, your IP must be allowed in the RDS security group — otherwise login/auth will hang or return Prisma timeouts.

**Node version:** use Node 22 (`nvm use` — see `.nvmrc`). Node 23 is unsupported and can break Prisma.

If login shows **Internal Server Error** with a Prisma `findUnique` message, the API cannot reach Postgres (wrong `DATABASE_URL`) or the API process is crash-looping. Stop all dev servers (`Ctrl+C`), ensure only one thing listens on `3001`, then run `pnpm dev` again.
```

Billing module: after schema changes, `pnpm db:push` creates `PlatformPricingConfig` and `OrganizationBilling`. `db:seed` loads default INR pricing.

# Apps
# | App   | Port | Purpose                          |
# |-------|------|----------------------------------|
# | web   | 8080 | Organization portal + meetings   |
# | admin | 8081 | Internal super admin portal      |
# | api   | 3001 | Shared backend                   |

# Seed accounts
# | Role        | Email                   | Password      | App   |
# |-------------|-------------------------|---------------|-------|
# | Super Admin | superadmin@lyrus.life   | ChangeMe123!  | admin |
# | Org Admin   | admin@demo-corp.example | ChangeMe123!  | web   |

# Run individual apps
# pnpm --filter admin dev
# pnpm --filter web dev
# pnpm --filter api dev

# Architecture: docs/MULTI_TENANT_ARCHITECTURE.md

