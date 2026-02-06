import { prisma } from "../../lib/prisma";

export function createPaymentIntent(data: {
  orderId: string;
  userId: string;
  campaignId: string;
  amount: number;
  currency: string;
}) {
  return prisma.payment_intents.create({
    data: {
      ...data,
      status: "CREATED",
    },
  });
}

export function findPaymentIntentByOrderId(orderId: string) {
  return prisma.payment_intents.findUnique({ where: { orderId } });
}

export function markPaymentIntentSuccess(orderId: string) {
  return prisma.payment_intents.update({
    where: { orderId },
    data: { status: "SUCCESS" },
  });
}
