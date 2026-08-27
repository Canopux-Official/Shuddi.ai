import { z } from "zod";

// Input schema for fetching tasks with cursor pagination
export const GetTasksQuerySchema = z.object({
  timeline: z.enum(["upcoming", "ongoing", "past"]).default("upcoming"),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(10),
});

/* 
  EXPECTED ZOD OUTPUT SCHEMA FOR /tasks (Discovery)
  z.object({
    data: z.array(z.object({
      id: z.string(),
      taskId: z.string(), // ID of the base Task
      title: z.string(),
      startAt: z.date().nullable(),
      endAt: z.date().nullable(),
      locationName: z.string().nullable(),
      totalRegistrations: z.number()
    })),
    meta: z.object({
      nextCursor: z.string().nullable(),
      hasNextPage: z.boolean()
    })
  })
*/

/* 
  EXPECTED ZOD OUTPUT SCHEMA FOR /tasks/:taskId (Details & Stats)
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    startAt: z.date().nullable(),
    endAt: z.date().nullable(),
    locationName: z.string().nullable(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    radiusMeters: z.number(),
    stats: z.record(z.string(), z.number()) // e.g., { "REGISTERED": 15, "UNDER_VERIFICATION": 5 }
  })
*/


// Input schema for the query parameters
export const GetParticipantsQuerySchema = z.object({
  status: z.enum(["REGISTERED", "SUBMITTED", "UNDER_VERIFICATION", "COMPLETED", "REJECTED"]).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
});

/* 
  EXPECTED ZOD OUTPUT SCHEMA FOR /tasks/:taskId/participants
  z.object({
    data: z.array(z.object({
      registrationId: z.string(),
      userId: z.string(),
      status: z.string(),
      checkInTime: z.date().nullable(),
      displayName: z.string().nullable(),
      avatarUrl: z.string().nullable(),
    })),
    meta: z.object({
      nextCursor: z.string().nullable(),
      hasNextPage: z.boolean(),
      totalParticipants: z.number()
    })
  })
*/