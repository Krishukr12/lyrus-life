import type { Request } from "express";
import type { AuthUser } from "./express.js";

/** Meeting-scoped routes (`/meetings/:id/...`). */
export type MeetingIdRequest = Request<{ id: string }> & { authUser: AuthUser };

/** Join-by-slug routes (`/meetings/join/:slug/...`). */
export type JoinSlugRequest = Request<{ slug: string }> & { authUser: AuthUser };

/** Task update routes (`/tasks/:id`). */
export type TaskIdRequest = Request<{ id: string }> & { authUser: AuthUser };
