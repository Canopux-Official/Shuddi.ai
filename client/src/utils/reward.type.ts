export type Reward = {
  id: string;
  name: string;
  description: string;
  credits: number;
  icon: string;
  isActive: boolean;
  createdAt: string;   // ISO string
  updatedAt: string;
}

export type HistoryItem = {
  id: string;
  amount: number;
  type: string;
  reason: string;
  createdAt: string;
  taskTitle: string | null;
};

export type HistoryResponse = {
  items: HistoryItem[];
  message: string | null;
};