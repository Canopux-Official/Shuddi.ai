import { prisma } from "../../lib/prisma";
import { TaskCompletionStatus } from "@prisma/client";
import { triggerRewardFlow } from "./reward.orchestrator";

export const processVerification = async (
  taskScoreId: string
) => {
  
  // Phase-1: SYSTEM auto verification
  const taskScore = await prisma.taskScore.update({
    where: { id: taskScoreId },
    data: {
      status: TaskCompletionStatus.VERIFIED,
      performanceScore: 100,
      verificationSource: "SYSTEM",
      verifiedAt: new Date(),
    },
  });



  // 🔥 AUTOMATION TRIGGER
  const result = await triggerRewardFlow(taskScore.id);

  return {taskScore, status: result.status};
};
