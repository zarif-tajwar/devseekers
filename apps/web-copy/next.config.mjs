import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));

/**
 * Validates required env vars before building the server.
 * Stops the build process if a required env var is missing
 */
jiti.import("./src/env.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
};

export default nextConfig;
