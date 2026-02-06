import type { CampaignDTO } from '../../../apis/campaign/campaign.api';
import type { Foundation } from '../types/types';

export const mapCampaignToFoundation = (
  campaign: CampaignDTO
): Foundation => {
  return {
    id: campaign.id,
    name: campaign.title,
    description: campaign.description ?? '',
    verified: true, // campaigns are backend-approved
  };
};
