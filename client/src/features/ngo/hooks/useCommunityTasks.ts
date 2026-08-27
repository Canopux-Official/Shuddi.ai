import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCommunityTasks,
  getCommunityTaskDetails,
} from "../../../apis/ngo/applyNGO";
import type { TaskTimeline } from "../types/communityTasks";

const PAGE_SIZE = 9;

export const communityTaskKeys = {
  all: (ngoId: string) => ["ngo", ngoId, "community-tasks"] as const,
  list: (ngoId: string, timeline: TaskTimeline) =>
    [...communityTaskKeys.all(ngoId), "list", timeline] as const,
  detail: (ngoId: string, taskId: string) =>
    [...communityTaskKeys.all(ngoId), "detail", taskId] as const,
  // Reserved for the participants dashboard: useCommunityTaskParticipants
  // will key off this so invalidating a task's detail can also invalidate
  // its participant list (e.g. after a rating is submitted).
  participants: (ngoId: string, taskId: string) =>
    [...communityTaskKeys.detail(ngoId, taskId), "participants"] as const,
};

export function useCommunityTasks(ngoId: string, timeline: TaskTimeline) {
  return useInfiniteQuery({
    queryKey: communityTaskKeys.list(ngoId, timeline),
    queryFn: ({ pageParam }) =>
      getCommunityTasks({ ngoId, timeline, limit: PAGE_SIZE, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.nextCursor ?? undefined : undefined,
    enabled: Boolean(ngoId),
  });
}

export function useCommunityTaskDetails(ngoId: string, taskId: string | null) {
  return useQuery({
    queryKey: communityTaskKeys.detail(ngoId, taskId ?? ""),
    queryFn: () => getCommunityTaskDetails(ngoId, taskId as string),
    enabled: Boolean(ngoId && taskId),
  });
}

// Call after creating a community task so the "upcoming" list picks it up
// without a full page reload.
export function useInvalidateCommunityTasks(ngoId: string) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: communityTaskKeys.all(ngoId) });
}