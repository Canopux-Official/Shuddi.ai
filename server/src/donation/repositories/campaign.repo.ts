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

export async function getAllCampaign(){
  const campaigns = await prisma.campaigns.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      description: true,
      isActive: true,
      createdAt: true,
    },
  });
  return campaigns;
}