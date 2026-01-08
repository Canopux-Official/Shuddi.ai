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