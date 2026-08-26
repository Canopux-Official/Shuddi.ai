import { z } from "zod";

export const createCommunityTaskSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(15, "Description must be at least 15 characters"),
  baseScore: z.number().int().positive("Base score must be a positive integer"),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
  maxParticipants: z.number().int().positive().optional(),
  minParticipants: z.number().int().positive().optional(),
  locationName: z.string().optional(),

  latitude: z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90").optional(),
  longitude: z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180").optional(),
  radiusMeters: z.number().int().positive("Radius must be positive").default(100).optional(),

  areaId: z.string().cuid("Invalid area ID format"),
  ngoId: z.string().cuid("Invalid NGO ID format"), // Extracted from body payload
});

export type CreateCommunityTaskInput = z.infer<typeof createCommunityTaskSchema>;