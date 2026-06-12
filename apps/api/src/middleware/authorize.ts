import type { NextFunction, Request, Response } from "express";
import { UserRole } from "@lyrus/db";
import { requireAuthUser } from "./authenticate.js";

type Role = (typeof UserRole)[keyof typeof UserRole];

export function authorize(allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = requireAuthUser(req);
    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        error: "forbidden",
        message: "You do not have permission to perform this action",
      });
      return;
    }
    next();
  };
}
