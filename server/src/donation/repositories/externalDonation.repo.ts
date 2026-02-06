import { prisma } from "../../lib/prisma";

export async function insertExternalDonation(data: {
  paymentId: string;
  orderId: string;
  campaignId: string;
  amount: number;
  currency: string;
}) {
  return prisma.external_donations.create({ data });
}
