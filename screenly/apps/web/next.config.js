/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  /** Workspace packages ship TS source and are transpiled by Next. */
  transpilePackages: [
    "@screenly/api",
    "@screenly/auth",
    "@screenly/db",
    "@screenly/ui",
    "@screenly/validators",
  ],
};

export default config;
