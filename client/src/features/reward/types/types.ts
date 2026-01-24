export interface RewardItem {
  id: string;
  name: string;
  description: string;
  credits: number;
  icon: string;
}

export interface DonationCategory {
  id: string;
  name: string;
  icon: string;
}

export interface Foundation {
  id: string;
  name: string;
  description: string;
  verified: boolean;
}

export interface DonationHistory {
  id: string;
  type: 'Foundation' | 'Campaign' | 'NGO';
  recipient: string;
  credits: number;
  date: string;
}