import { z } from "zod";

/**
 * Environment variables schema validation
 * Ensures all required environment variables are present and valid at startup
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),

  // Clerk Authentication
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required"),
  CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default("/sign-in"),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default("/sign-up"),

  // Inngest
  INNGEST_EVENT_KEY: z.string().min(1, "INNGEST_EVENT_KEY is required"),
  INNGEST_SIGNING_KEY: z.string().min(1, "INNGEST_SIGNING_KEY is required"),

  // E2B Sandboxes
  E2B_API_KEY: z.string().min(1, "E2B_API_KEY is required"),
  SANDBOX_TIMEOUT: z.string().default("600000"),

  // Google AI
  GOOGLE_AI_API_KEY: z.string().min(1, "GOOGLE_AI_API_KEY is required"),

  // Optional
  NEXT_PUBLIC_AVATAR_URL: z.string().url().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

/**
 * Validated environment variables
 * Use this throughout your application instead of process.env
 */
export const env = envSchema.parse(process.env);

/**
 * Client-safe environment variables
 * Only includes NEXT_PUBLIC_ prefixed variables
 */
export const clientEnv = {
  CLERK_PUBLISHABLE_KEY: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLERK_SIGN_IN_URL: env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  CLERK_SIGN_UP_URL: env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  AVATAR_URL: env.NEXT_PUBLIC_AVATAR_URL,
  NODE_ENV: env.NODE_ENV,
} as const;
