type AuthHandlers = {
  onUnauthorized?: () => void;
  onForbidden?: () => void;
};

let handlers: AuthHandlers = {};

export function setApiAuthHandlers(next: AuthHandlers) {
  handlers = next;
}

export function getApiAuthHandlers(): AuthHandlers {
  return handlers;
}
