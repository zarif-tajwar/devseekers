import z from "zod";

export const TestDto = z.object({
  greet: z.enum(["say hi", "say hello"]),
});

export type TestDto = z.infer<typeof TestDto>;
