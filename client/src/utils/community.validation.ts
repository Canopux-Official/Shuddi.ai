import { z } from "zod";

export const communityTaskSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(15, "Description must be at least 15 characters"),

    baseScore: z.preprocess(
        (value) => value === "" ? undefined : Number(value),
        z.number({
            error: "Base score is required"
        })
            .int("Must be an integer")
            .positive("Must be a positive integer")
    ),

    startAt: z.string().optional(),
    endAt: z.string().optional(),

    maxParticipants: z.coerce.number().int().positive().optional().or(z.literal(0)).transform(n => n === 0 ? undefined : n),
    minParticipants: z.coerce.number().int().positive().optional().or(z.literal(0)).transform(n => n === 0 ? undefined : n),

    locationName: z.string().optional(),

    // New Spatial Fields
    latitude: z.number().min(-90, "Invalid latitude").max(90, "Invalid latitude").optional(),
    longitude: z.number().min(-180, "Invalid longitude").max(180, "Invalid longitude").optional(),
    radiusMeters: z.coerce.number().int().positive().default(100).optional(),

    areaId: z.string().min(1, "Area selection is required"),
    ngoId: z.string().min(1, "NGO ID is required"),
});

export type CommunityTaskFormData = z.infer<typeof communityTaskSchema>;


// Mirrors the Prisma `TaskStatus` enum (schema.prisma) so the frontend
// gets a closed, autocompletable union instead of `string`.
export const registrationStatusEnum = z.enum([
  "REGISTERED",
  "SUBMITTED",
  "UNDER_VERIFICATION",
  "COMPLETED",
  "REJECTED",
]);
//if the db schema for task status changes, this enum must be updated to match. 
// Otherwise, the frontend will not recognize new statuses and may break.
 
export type RegistrationStatus = z.infer<typeof registrationStatusEnum>;
 
export const communityTaskDetailSchema = z.object({
  communityTaskId: z.string(),
  taskId: z.string(),
  title: z.string(),
  description: z.string(),
  baseScore: z.number(),
  startAt: z.string().optional(),
  endAt: z.string().optional(),
  isActive: z.boolean(),
  locationName: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radiusMeters: z.number().optional(),
  maxParticipants: z.number().nullable().optional(),
  minParticipants: z.number().nullable().optional(),
  registeredCount: z.number(),
  isFull: z.boolean(),
  isRegistered: z.boolean(),
  registrationStatus: registrationStatusEnum.nullable().optional(),
  ngoName: z.string(),
  areaName: z.string(),
});
 
export type CommunityTaskDetail = z.infer<typeof communityTaskDetailSchema>;
