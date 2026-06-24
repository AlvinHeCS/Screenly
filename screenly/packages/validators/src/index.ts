import { z } from "zod";

/**
 * Shared zod schemas live here so the web app, tRPC routers, and (later) the
 * Electron client all validate against the same shapes. Seed it with the few
 * pieces the MVP needs; grow it as routers come online.
 */

export const videoTitleSchema = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(120, "Title is too long");

export const createVideoSchema = z.object({
  title: videoTitleSchema.optional(),
  mode: z.enum(["SCREEN", "CAMERA", "BOTH"]).default("SCREEN"),
});
export type CreateVideoInput = z.infer<typeof createVideoSchema>;

export const cuidSchema = z.string().cuid();
