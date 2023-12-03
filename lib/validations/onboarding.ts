import { z } from "zod";

export const finishOnboardingSchema = z.object({
  githubLogin: z.string(),
});
