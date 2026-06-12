import type { NextFunction, Request, Response } from "express";
import { HttpAuthError } from "./meeting-access.js";

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    void Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function sendAuthError(res: Response, err: unknown): Response | void {
  if (err instanceof HttpAuthError) {
    return res.status(err.statusCode).json({ error: err.code, message: err.message });
  }
  throw err;
}

export function handleJoinAuthError(res: Response, err: unknown): Response | void {
  return sendAuthError(res, err);
}
