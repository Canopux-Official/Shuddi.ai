import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getParticipants, verifyParticipant, endCommunityEvent } from "../../../apis/ngo/applyNGO";
import { communityTaskKeys } from "./useCommunityTasks";
import type { RegistrationStatus } from "../types/communityTasks";

const PAGE_SIZE = 15;

export const participantKeys = {
  all: (ngoId: string, taskId: string) =>
    [...communityTaskKeys.detail(ngoId, taskId), "participants"] as const,
  list: (ngoId: string, taskId: string, status: RegistrationStatus) =>
    [...participantKeys.all(ngoId, taskId), "list", status] as const,
};

export function useParticipants(ngoId: string, taskId: string, status: RegistrationStatus) {
  return useInfiniteQuery({
    queryKey: participantKeys.list(ngoId, taskId, status),
    queryFn: ({ pageParam }) =>
      getParticipants({ ngoId, taskId, status, limit: PAGE_SIZE, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.nextCursor ?? undefined : undefined,
    enabled: Boolean(ngoId && taskId),
  });
}

export function useVerifyParticipant(ngoId: string, taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, stars }: { userId: string; stars: number }) =>
      verifyParticipant(ngoId, taskId, userId, stars),

    // Optimistically drop the participant from the currently-open
    // "under verification" list immediately, so a fast second click (or
    // slow network) can't fire a duplicate request before the refetch lands.
    onMutate: async ({ userId }) => {
      const key = participantKeys.list(ngoId, taskId, "UNDER_VERIFICATION");
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key);

      queryClient.setQueryData(key, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((p: any) => p.userId !== userId),
          })),
        };
      });

      return { previous, key };
    },

    onError: (_err, _vars, context) => {
      // Roll back the optimistic removal — status wasn't actually changed.
      if (context?.previous) {
        queryClient.setQueryData(context.key, context.previous);
      }
    },

    onSettled: () => {
      // Reconcile every status tab against the real backend state, and
      // refresh the stats breakdown shown in Overview.
      queryClient.invalidateQueries({ queryKey: participantKeys.all(ngoId, taskId) });
      queryClient.invalidateQueries({ queryKey: communityTaskKeys.detail(ngoId, taskId) });
    },
  });
}

export function useEndCommunityEvent(ngoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => endCommunityEvent(ngoId, taskId),
    onSuccess: (_data, taskId) => {
      queryClient.invalidateQueries({ queryKey: participantKeys.all(ngoId, taskId) });
      queryClient.invalidateQueries({ queryKey: communityTaskKeys.detail(ngoId, taskId) });
      queryClient.invalidateQueries({ queryKey: communityTaskKeys.all(ngoId) }); // event moves out of "ongoing"
    },
  });
}