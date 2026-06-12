# Multi-Tenant SaaS Architecture

## Overview

Lyrus Life uses **shared-database, shared-schema** multi-tenancy. Every business row is scoped with `organization_id`. The API enforces tenant boundaries in middleware and repositories—never rely on the client to filter.

## Entity Relationships

```
Organization 1──* User
Organization 1──* Meeting
Organization 1──* TenantAuditLog
User 1──0..1 EmployeeProfile
User 1──* Meeting (as organizer)
Meeting 1──* MeetingParticipant, AudioFile, Transcript, …
```

### Roles

| Role | Scope | Portal |
|------|--------|--------|
| `SUPER_ADMIN` | Platform-wide | `/admin` |
| `ORG_ADMIN` | Single organization | `/org` |
| `EMPLOYEE` | Single organization | `/` (meetings) + `/org` dashboard |

Super admins have `organization_id = null`. All other users must have `organization_id` set.

## Tenant Isolation Strategy

1. **JWT** carries `sub`, `role`, `organizationId`.
2. **`authenticate`** reloads the user from DB (active status only).
3. **`requireTenantContext`** sets `req.tenant.organizationId` from the user or `X-Organization-Id` (super admin only).
4. **`assertTenantMatch`** blocks cross-tenant access for non–super-admins.
5. **Repositories** always include `organizationId` in `where` clauses for org-scoped queries.
6. **Meetings** store `organization_id` on create; list/filter uses `meetingsListWhere()`.

## API Contracts

### Auth

`POST /auth/login`

```json
{
  "token": "jwt…",
  "user": { "id", "email", "name", "role", "organizationId" },
  "organization": { "id", "name", "slug", "status", "subscriptionPlan" } | null
}
```

`POST /auth/change-password` · `POST /auth/logout` · `POST /auth/forgot-password`

### Super Admin

| Method | Path |
|--------|------|
| GET | `/admin/stats` |
| GET/POST | `/admin/organizations` |
| GET/PATCH | `/admin/organizations/:id` |
| POST | `/admin/organizations/:id/activate` |
| POST | `/admin/organizations/:id/suspend` |

### Organization

| Method | Path | Roles |
|--------|------|-------|
| GET | `/organizations/dashboard` | ORG_ADMIN, EMPLOYEE |
| GET/POST | `/organizations/users` | ORG_ADMIN |
| GET/PATCH/DELETE | `/organizations/users/:id` | ORG_ADMIN |
| POST | `/organizations/users/:id/reset-password` | ORG_ADMIN |

## Backend Layout

```
apps/api/src/
├── middleware/     authenticate, authorize, tenant-context, security
├── repositories/   organization, user (tenant-aware queries)
├── services/       organization, user-management, tenant-audit
├── routes/
│   ├── admin/      platform APIs
│   ├── organization/ tenant user APIs
│   ├── auth.ts
│   └── meetings.ts (existing, org-scoped)
└── utils/          password (bcrypt + scrypt upgrade), slug
```

## Security

- **Passwords**: bcrypt (12 rounds); legacy scrypt hashes upgraded on login.
- **JWT**: HS256 via `jose`, httpOnly cookie + Bearer header.
- **Helmet**, **rate limiting** (global + auth).
- **Zod** validation (`@lyrus/shared/tenant-schemas`).
- **TenantAuditLog** for auth and admin actions (separate from pipeline `AuditLog`).

## Frontend Layout

```
apps/
├── admin/          Super admin portal (internal team) — port 8081
├── web/            Organization portal + meetings — port 8080
└── api/            Shared Express API — port 3001

apps/admin/src/
├── pages/          Dashboard, organizations, login
├── layouts/        AdminLayout
└── services/       admin API client

apps/web/src/
├── features/org/   Org dashboard & employees
├── layouts/        OrgLayout
└── services/       org API client
```

Super admins use **apps/admin** only. Org admins and employees use **apps/web**.
If a super admin signs in on the web app, they are redirected to the admin app.

## Database Indexing (scale)

- `Organization`: `status`, `subscriptionPlan`, `createdAt`
- `User`: `(organizationId)`, `(organizationId, status)`, `(organizationId, role)`
- `Meeting`: `(organizationId, scheduledAt)`, `(organizationId, status)`, `(organizationId, createdAt)`
- `TenantAuditLog`: `(organizationId, createdAt)`, `action`, `createdAt`

Designed for ~500 orgs, ~50k users, millions of meetings via composite indexes and paginated list APIs.

## Seed & Local Dev

```bash
pnpm db:pre-migrate   # existing DBs only — converts USER/ADMIN roles
pnpm db:push:force
pnpm db:seed
```

| Variable | Default |
|----------|---------|
| `SEED_SUPER_ADMIN_EMAIL` | superadmin@lyrus.life |
| `SEED_SUPER_ADMIN_PASSWORD` | ChangeMe123! |
| `SEED_ORG_ADMIN_EMAIL` | admin@demo-corp.example |

## Future Scalability

- **Read replicas** for analytics (`/admin/stats`, dashboards).
- **Partition** `Meeting` / `TenantAuditLog` by `organization_id` or time when row counts exceed millions.
- **Row-level security** in PostgreSQL as a defense-in-depth layer.
- **Per-tenant LiveKit** namespaces using `livekit_room_id` + org slug prefix.
- **Background jobs** for invite/welcome email instead of inline SMTP.
- **Optional subdomain routing** (`acme.app.com` → `organization.slug`).
