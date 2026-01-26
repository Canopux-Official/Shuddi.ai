import { prisma } from "../../lib/prisma";

export function createCampaign(data: {
  title: string;
  description?: string;
}) {
  return prisma.campaigns.create({ data });
}

export function findCampaignById(id: string) {
  return prisma.campaigns.findUnique({ where: { id } });
}
