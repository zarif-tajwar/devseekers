export const accountTypes = ["email", "oauth"] as const;
export type AccountTypes = (typeof accountTypes)[number];

export const providers = ["google", "github"] as const;
export type Providers = (typeof providers)[number];
