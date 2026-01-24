import type { DonationCategory, DonationHistory, Foundation, RewardItem } from "../types/types";

export const rewardItems: RewardItem[] = [
  {
    id: '1',
    name: 'Eco-Friendly Tote Bag',
    description: 'Made from recycled materials',
    credits: 200,
    icon: 'bag',
  },
  {
    id: '2',
    name: 'Plant a Tree Certificate',
    description: 'We plant a tree in your name',
    credits: 150,
    icon: 'tree',
  },
  {
    id: '3',
    name: 'Local Café Voucher',
    description: '₹100 off at partner cafés',
    credits: 100,
    icon: 'cafe',
  },
  {
    id: '4',
    name: 'Eco Workshop Pass',
    description: 'Free entry to sustainability workshop',
    credits: 300,
    icon: 'workshop',
  },
];

export const donationCategories: DonationCategory[] = [
  { id: '1', name: 'Social Foundations', icon: 'volunteers' },
  { id: '2', name: 'Environmental Campaigns', icon: 'campaign' },
  { id: '3', name: 'NGO Support Pools', icon: 'handshake' },
];

export const foundations: Foundation[] = [
  {
    id: '1',
    name: 'Girls Education Foundation',
    description: 'Supporting education for underprivileged girls',
    verified: true,
  },
  {
    id: '2',
    name: 'Old Age Care Foundation',
    description: 'Providing care and support for senior citizens',
    verified: true,
  },
  {
    id: '3',
    name: 'Martyr Families Support Foundation',
    description: 'Supporting families of fallen soldiers',
    verified: true,
  },
];

export const donationHistory: DonationHistory[] = [
  {
    id: '1',
    type: 'Foundation',
    recipient: 'Girls Education Foundation',
    credits: 100,
    date: '10 Jan 2026',
  },
  {
    id: '2',
    type: 'Campaign',
    recipient: 'Mumbai Beach Cleanup 2026',
    credits: 250,
    date: '5 Jan 2026',
  },
  {
    id: '3',
    type: 'NGO',
    recipient: 'EcoWarriors Foundation',
    credits: 150,
    date: '28 Dec 2025',
  },
  {
    id: '4',
    type: 'Foundation',
    recipient: 'Old Age Care Foundation',
    credits: 50,
    date: '20 Dec 2025',
  },
];