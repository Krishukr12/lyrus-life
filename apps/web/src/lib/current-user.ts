import type { AuthUser } from "./auth-api";

let currentUser: AuthUser | null = null;

export function setCurrentUser(user: AuthUser | null) {
  currentUser = user;
}

export function getCurrentUser(): AuthUser | null {
  return currentUser;
}

export function getCurrentUserDisplayName(): string {
  return currentUser?.name ?? "User";
}
