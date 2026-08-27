import { prisma } from "../../lib/prisma"
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";
import { calculateDistanceInMeters } from "../utils/geo.util";

export const processCheckIn = async (userId: string, taskId: string, userLatitude: number, userLongitude: number) => {
    // 1. Fetch the registration and the task details
    const registration = await prisma.communityTaskRegistration.findUnique({
      where: {
        taskId_userId: { taskId, userId }
      },
      include: {
        task: {
          include: { task: true } // Includes the base Task for time validation
        }
      }
    });

    if (!registration) {
      throw new Error("You are not registered for this task.");
    }

    if (registration.status !== "REGISTERED") {
      throw new Error(`Invalid status for check-in. Current status: ${registration.status}`);
    }

    const { task: communityTask } = registration;
    const baseTask = communityTask.task;
    const now = new Date();

    // 2. Validate Time: Ensure the task has started
    if (!baseTask.startAt || now < baseTask.startAt) {
      throw new Error("Check-in failed: This event has not started yet.");
    }
    
    // Ensure the task hasn't completely ended
    if (baseTask.endAt && now > baseTask.endAt) {
      throw new Error("Check-in failed: This event has already ended.");
    }

    // 3. Validate Location
    if (!communityTask.latitude || !communityTask.longitude) {
      throw new Error("Event location coordinates are missing.");
    }

    const distance = calculateDistanceInMeters(
      userLatitude, userLongitude,
      communityTask.latitude, communityTask.longitude
    );

    if (distance > communityTask.radiusMeters) {
      throw new Error(`You are too far away. You are ${distance}m away, but must be within ${communityTask.radiusMeters}m to check in.`);
    }

    // 4. Execute the Check-In Mutation
    const updatedRegistration = await prisma.communityTaskRegistration.update({
      where: { id: registration.id },
      data: {
        status: "UNDER_VERIFICATION", // Flags them as "Present" for the NGO dashboard
        checkInLat: userLatitude,
        checkInLng: userLongitude,
        checkInTime: now,
      }
    });

    return {
      message: "Check-in successful! You are marked as present.",
      distanceMeters: distance
    };
}