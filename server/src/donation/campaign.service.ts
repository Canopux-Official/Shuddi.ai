import { createCampaign, findCampaignById } from "./repositories/campaign.repo";

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
