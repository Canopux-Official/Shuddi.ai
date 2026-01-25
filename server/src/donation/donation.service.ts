import { createRazorpayOrder } from "./razorpay/razorpay.client";
import {
  createPaymentIntent,
  findPaymentIntentByOrderId,
  markPaymentIntentSuccess,
} from "./repositories/paymentIntent.repo";
import { insertExternalDonation } from "./repositories/externalDonation.repo";
import { validateCampaign } from "./campaign.service";

export async function createPaymentIntentService(input: {
  userId: string;
  campaignId: string;
  amount: number;
}) {
  if (input.amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  await validateCampaign(input.campaignId);

  const order = await createRazorpayOrder(input.amount);

  await createPaymentIntent({
    orderId: order.id,
    userId: input.userId,
    campaignId: input.campaignId,
    amount: input.amount,
    currency: "INR",
  });

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  };
}

export async function confirmDonationFromWebhook(input: {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
}) {
  const intent = await findPaymentIntentByOrderId(input.orderId);
  if (!intent) return;

  try {
    await insertExternalDonation({
      paymentId: input.paymentId,
      orderId: input.orderId,
      campaignId: intent.campaignId,
      amount: input.amount,
      currency: input.currency,
    });
  } catch (e) {
    // idempotency: duplicate webhook
    return;
  }

  await markPaymentIntentSuccess(input.orderId);
}

export async function getPaymentIntentStatus(orderId: string) {
  const intent = await findPaymentIntentByOrderId(orderId);
  if (!intent) {
    throw new Error("Payment intent not found");
  }
  return intent.status;
}
