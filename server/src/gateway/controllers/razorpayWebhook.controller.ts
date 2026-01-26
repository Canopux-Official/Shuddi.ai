import { Request, Response } from "express";
import { verifyRazorpayWebhook } from "../../donation/razorpay/webhook.verify";
import { confirmDonationFromWebhook } from "../../donation/donation.service";

// Enter the default OTP 754081 when prompted, while setting up, editing or deleting a webhook in test mode.

export async function handleRazorpayWebhook(
  req: Request,
  res: Response
) {
  const signature = req.headers["x-razorpay-signature"] as string;

  if (!signature) {
    return res.status(400).json({ message: "Missing Razorpay signature" });
  }

  const rawBody = req.body; // Buffer (because of express.raw)

  const isValid = verifyRazorpayWebhook(
    rawBody.toString("utf8"),
    signature
  );

  if (!isValid) {
    return res.status(401).json({ message: "Invalid webhook signature" });
  }

  const event = JSON.parse(rawBody.toString("utf8"));

  // We only care about payment.captured
  if (event.event !== "payment.captured") {
    return res.status(200).json({ status: "ignored" });
  }

  const payment = event.payload.payment.entity;

  await confirmDonationFromWebhook({
    paymentId: payment.id,
    orderId: payment.order_id,
    amount: payment.amount,
    currency: payment.currency,
  });

  return res.status(200).json({ status: "processed" });
}
