import type { AuthOrganization } from "@/lib/auth-api";

const LOCK_KEY = "mda_workspace_lock";

const WORKSPACE_LOCK_CODES = new Set([
  "trial_expired",
  "billing_overdue",
  "billing_cancelled",
  "organization_inactive",
]);

export type WorkspaceLockState = {
  message: string;
  code: string;
};

export function getWorkspaceLock(): WorkspaceLockState | null {
  try {
    const raw = sessionStorage.getItem(LOCK_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WorkspaceLockState;
    if (!parsed?.message) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setWorkspaceLock(message: string, code = "trial_expired"): void {
  try {
    sessionStorage.setItem(
      LOCK_KEY,
      JSON.stringify({ message, code } satisfies WorkspaceLockState),
    );
  } catch {
    // ignore quota / private mode
  }
}

export function clearWorkspaceLock(): void {
  try {
    sessionStorage.removeItem(LOCK_KEY);
  } catch {
    // ignore
  }
}

export function isWorkspaceLockCode(code?: string | null): boolean {
  return Boolean(code && WORKSPACE_LOCK_CODES.has(code));
}

export function isWorkspaceLockMessage(message?: string | null): boolean {
  if (!message) return false;
  return /trial|upgrade your plan|billing is overdue|subscription has been cancelled|settle outstanding|not authorized to do so/i.test(
    message,
  );
}

export function isWorkspaceLocked(organization: AuthOrganization | null | undefined): boolean {
  if (getWorkspaceLock()) return true;
  if (!organization) return false;

  const status = organization.billingStatus;
  if (status === "OVERDUE" || status === "CANCELLED") return true;

  if (organization.trialEndsAt) {
    const ended = new Date(organization.trialEndsAt).getTime() < Date.now();
    if (ended && (status === "TRIAL" || status === "PENDING" || !status)) {
      return true;
    }
  }

  return false;
}

export function isIntegrationsPath(pathname: string): boolean {
  return (
    pathname === "/settings/integrations" ||
    pathname.startsWith("/integrations/") ||
    pathname === "/trial-expired"
  );
}

export function shouldRedirectToTrialScreen(input: {
  code?: string | null;
  message?: string | null;
  organization?: AuthOrganization | null;
}): boolean {
  if (getWorkspaceLock()) return true;
  if (isWorkspaceLockCode(input.code)) return true;
  if (isWorkspaceLockMessage(input.message)) return true;
  if (isWorkspaceLocked(input.organization)) return true;
  return false;
}

export function isWorkspaceLockError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as { code?: string; message?: string; status?: number };
  if (err.status === 403 && shouldRedirectToTrialScreen({ code: err.code, message: err.message })) {
    return true;
  }
  return shouldRedirectToTrialScreen({ code: err.code, message: err.message });
}
