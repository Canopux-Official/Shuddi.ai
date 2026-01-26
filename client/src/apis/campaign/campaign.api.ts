import axios from 'axios';

export type CampaignDTO = {
  id: string;
  title: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
};

export const getCampaigns = async (): Promise<CampaignDTO[]> => {
  const { data } = await axios.get('/api/donation/campaign');

  if (!data?.success) {
    throw new Error('Failed to fetch campaigns');
  }

  return data.data;
};
