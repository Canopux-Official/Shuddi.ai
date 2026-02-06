export interface AvailableCommunityTask {
  communityTaskId: string;
  taskId: string;
  title: string;
  description: string;
  startAt?: string;
  endAt?: string;
  maxParticipants: number | null;
}

export interface AvailableTasksResponse {
  items: AvailableCommunityTask[];
}

export const mockAvailableTasks: AvailableTasksResponse = {
  items: [
    {
      communityTaskId: "ct_001",
      taskId: "task_101",
      title: "City Park Clean-Up Drive",
      description:
        "Join volunteers to clean plastic waste and restore greenery in the city park.",
      startAt: "2025-01-15T08:00:00.000Z",
      endAt: "2025-01-15T12:00:00.000Z",
      maxParticipants: 50
    },
    {
      communityTaskId: "ct_002",
      taskId: "task_102",
      title: "Beach Plastic Removal",
      description:
        "Help remove plastic waste from the beach and protect marine life.",
      startAt: "2025-01-20T06:00:00.000Z",
      endAt: "2025-01-20T11:00:00.000Z",
      maxParticipants: 100
    },
    {
      communityTaskId: "ct_003",
      taskId: "task_103",
      title: "Tree Plantation Drive",
      description:
        "Plant native trees and contribute to a greener environment.",
      startAt: "2025-01-25T07:30:00.000Z",
      endAt: "2025-01-25T10:30:00.000Z",
      maxParticipants: null
    }
  ]
};
