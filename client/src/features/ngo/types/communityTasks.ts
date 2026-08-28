import { z } from "zod";

export const TASK_TIMELINES = ["upcoming", "ongoing", "past"] as const;
export type TaskTimeline = (typeof TASK_TIMELINES)[number];

// Mirrors Prisma's TaskStatus enum (used for CommunityTaskRegistration.status).
// Kept as an ordered array (not just a union) so the UI can render breakdowns
// in a stable, meaningful order without hardcoding switch statements.
export const REGISTRATION_STATUSES = [
  "REGISTERED",
  "SUBMITTED",
  "UNDER_VERIFICATION",
  "COMPLETED",
  "REJECTED",
] as const;
export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];

export const communityTaskListItemSchema = z.object({
  id: z.string(), // CommunityTask id
  taskId: z.string(), // base Task id
  title: z.string(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  locationName: z.string().nullable(),
  totalRegistrations: z.number(),
});
export type CommunityTaskListItem = z.infer<typeof communityTaskListItemSchema>;

export const communityTaskListResponseSchema = z.object({
  data: z.array(communityTaskListItemSchema),
  meta: z.object({
    nextCursor: z.string().nullable(),
    hasNextPage: z.boolean(),
  }),
});
export type CommunityTaskListResponse = z.infer<typeof communityTaskListResponseSchema>;

// Backend only includes statuses that have at least one registration —
// absence means zero, not "unknown". Consumers should default to 0.
export const taskStatsSchema = z.record(z.string(), z.number());

export const communityTaskDetailsSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  startAt: z.coerce.date().nullable(),
  endAt: z.coerce.date().nullable(),
  isActive: z.boolean(),
  locationName: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  radiusMeters: z.number(),
  stats: taskStatsSchema,
});
export type CommunityTaskDetails = z.infer<typeof communityTaskDetailsSchema>;

export const participantSchema = z.object({
  registrationId: z.string(),
  userId: z.string(),
  status: z.enum(REGISTRATION_STATUSES),
  checkInTime: z.coerce.date().nullable(),
  displayName: z.string(),
  avatarUrl: z.string().nullable(),
});
export type Participant = z.infer<typeof participantSchema>;

export const participantListResponseSchema = z.object({
  data: z.array(participantSchema),
  meta: z.object({
    nextCursor: z.string().nullable(),
    hasNextPage: z.boolean(),
    totalParticipants: z.number(),
  }),
});
export type ParticipantListResponse = z.infer<typeof participantListResponseSchema>;

export const verifyParticipantResponseSchema = z.object({
  taskScoreId: z.string(),
  status: z.string(),
});

export const endEventResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string(),
  rejectedCount: z.number(),
});