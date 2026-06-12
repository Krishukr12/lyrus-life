type AuthHandlers = {
  onUnauthorized?: () => void;
  onForbidden?: () => void;
  onOrganizationBlocked?: (message: string) => void;
};

let handlers: AuthHandlers = {};

export function setApiAuthHandlers(next: AuthHandlers) {
  handlers = next;
}

export function getApiAuthHandlers(): AuthHandlers {
  return handlers;
}
