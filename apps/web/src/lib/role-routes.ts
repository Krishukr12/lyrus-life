const ADMIN_APP_URL =
  import.meta.env.VITE_ADMIN_APP_URL ?? "http://localhost:8081";

export function homePathForRole(role: string): string {
  switch (role) {
    case "SUPER_ADMIN":
      return ADMIN_APP_URL;
    case "ORG_ADMIN":
      return "/";
    case "MANAGER":
      return "/";
    default:
      return "/";
  }
}

export function isExternalRedirect(path: string): boolean {
  return path.startsWith("http://") || path.startsWith("https://");
}

export function getAdminAppUrl(): string {
  return ADMIN_APP_URL;
}

export function canAccessOrgPortal(role: string): boolean {
  return (
    role === "ORG_ADMIN" ||
    role === "MANAGER" ||
    role === "EMPLOYEE" ||
    role === "VIEWER"
  );
}
