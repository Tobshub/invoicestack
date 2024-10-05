import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    GOOGLE_APPLICATION_CREDENTIALS_JSON: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_FB_API_KEY: z.string(),
    NEXT_PUBLIC_FB_AUTH_DOMAIN: z.string(),
    NEXT_PUBLIC_FB_PROJECT_ID: z.string(),
    NEXT_PUBLIC_FB_STORAGE_BUCKET: z.string(),
    NEXT_PUBLIC_FB_MESSAGING_SENDER_ID: z.string(),
    NEXT_PUBLIC_FB_APP_ID: z.string(),
    NEXT_PUBLIC_FB_MEASUREMENT_ID: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_APPLICATION_CREDENTIALS_JSON:
      process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
    NEXT_PUBLIC_FB_API_KEY: process.env.NEXT_PUBLIC_FB_API_KEY,
    NEXT_PUBLIC_FB_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
    NEXT_PUBLIC_FB_PROJECT_ID: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
    NEXT_PUBLIC_FB_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
    NEXT_PUBLIC_FB_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FB_APP_ID: process.env.NEXT_PUBLIC_FB_APP_ID,
    NEXT_PUBLIC_FB_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
