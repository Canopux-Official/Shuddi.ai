import { z } from "zod";

export const createRewardSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  credits: z.number().int().positive(),
  icon: z.string().url(),
});

export type CreateRewardInput = z.infer<typeof createRewardSchema>;