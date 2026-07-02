// src/types.ts
export interface Task {
  id: string;
  title: string;
  difficulty: string;
  points: number;
  image: string;
  icon: string;
}

export interface CommunityFeedItem {
  id: string;
  name: string;
  action: string;
  location: string;
  verifiedBy: string;
  image: string;
}

export interface ProgressStat {
  label: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

export interface OverviewData {
  username?: string;
  avatar?: string;
  xp: number;
  level: number;
  progressPercentage: number;
  streaks: { current: number; longest: number };
  walletBalance: number;
}

export interface ImpactData {
  totalContributions: number;
  totalWeightRemoved: number;
  nextMilestone: number;
  percentageToMilestone: number;
}

export interface BadgeItem {
  name: string;
  image: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  earnedAt: string;
}

export interface BadgesData {
  badges: BadgeItem[];
  stats: { earned: number; totalAvailable: number };
}

export interface ActivityDay {
  date: string;
  actions: number;
}

export interface ActivityData {
  history: ActivityDay[];
  engagementLevel: number;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  avatar: string | null;
}

export interface LeaderboardData {
  myRank: { global: number; regional: number };
  leaderboard: LeaderboardEntry[];
}