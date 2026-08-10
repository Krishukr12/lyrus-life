type AuthHandlers = {
  onUnauthorized?: () => void;
  onForbidden?: (message: string, code?: string) => void;
  onOrganizationBlocked?: (message: string) => void;
  /** Trial ended / billing locked — keep session so Integrations still works. */
  onWorkspaceLocked?: (message: string, code?: string) => void;
};

let handlers: AuthHandlers = {};

export function setApiAuthHandlers(next: AuthHandlers) {
  handlers = next;
}

export function getApiAuthHandlers(): AuthHandlers {
  return handlers;
}
