import Razorpay from "razorpay";

export const razorpayClient = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRazorpayOrder(amount: number, currency = "INR") {
  return razorpayClient.orders.create({
    amount,          // paise
    currency,
    payment_capture: true,
  });
}
