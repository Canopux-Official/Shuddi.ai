import { createCampaign, findCampaignById, getAllCampaign } from "./repositories/campaign.repo";

export async function createDonationCampaign(input: {
  title: string;
  description?: string;
}) {
  // TEMPORARY: move under admin later
  return createCampaign(input);
}

export async function validateCampaign(campaignId: string) {
  const campaign = await findCampaignById(campaignId);
  if (!campaign || !campaign.isActive) {
    throw new Error("Invalid or inactive campaign");
  }
  return campaign;
}

export const getAllCampaignsService = async () => {
  const campaigns = await getAllCampaign();
  if(!campaigns) throw new Error ("No active campaigns");
  return campaigns;
};
