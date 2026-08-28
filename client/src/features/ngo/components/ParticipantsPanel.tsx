import { useState } from "react";
import { Alert, Box, Button, Divider, Skeleton, Stack, Tabs, Tab, Typography, Chip } from "@mui/material";
import toast from "react-hot-toast";
import { useParticipants, useVerifyParticipant, useEndCommunityEvent } from "../hooks/useParticipants";
import ParticipantRow from "./ParticipantRow";
import EndEventDialog from "./EndEventDialog";
import { REGISTRATION_STATUS_META } from "../utils/taskTimeline";
import type { RegistrationStatus } from "../types/communityTasks";

const PARTICIPANT_TABS: RegistrationStatus[] = [
  "UNDER_VERIFICATION",
  "REGISTERED",
  "COMPLETED",
  "REJECTED",
];

interface Props {
  ngoId: string;
  taskId: string;
  timeline: "upcoming" | "ongoing" | "past";
  stats: Record<string, number>;
  hasEnded: boolean;
  canEndEvent: boolean;
  onEventEnded: () => void;
}

const ParticipantsPanel = ({ ngoId, taskId, timeline, stats, hasEnded, canEndEvent, onEventEnded }: Props) => {
  const [tab, setTab] = useState<RegistrationStatus>("UNDER_VERIFICATION");
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useParticipants(ngoId, taskId, tab);

  const verifyMutation = useVerifyParticipant(ngoId, taskId);
  const endEventMutation = useEndCommunityEvent(ngoId);

  const pendingVerificationCount = stats["UNDER_VERIFICATION"] ?? 0;
  const canShowEndEventControl =
    canEndEvent && !hasEnded && (timeline === "ongoing" || timeline === "past");

  if (timeline === "upcoming") {
    return (
      <Typography variant="body2" color="text.secondary" textAlign="center" py={5}>
        Participant check-in & rating opens once this event goes live.
      </Typography>
    );
  }

  const participants = data?.pages.flatMap((p) => p.data) ?? [];

  const handleSubmitRating = (userId: string, stars: number) => {
    setPendingUserId(userId);
    verifyMutation.mutate(
      { userId, stars },
      {
        onSuccess: () => toast.success("Participant verified"),
        onError: (err: any) => toast.error(err.message || "Couldn't verify this participant"),
        onSettled: () => setPendingUserId(null),
      }
    );
  };

  const handleConfirmEndEvent = () => {
    endEventMutation.mutate(taskId, {
      onSuccess: (result) => {
        toast.success(`Event ended · ${result.rejectedCount} no-show(s) marked rejected`);
        setEndDialogOpen(false);
        onEventEnded();
      },
      onError: (err: any) => toast.error(err.message || "Couldn't end the event"),
    });
  };

  return (
    <Stack spacing={2}>
      {hasEnded && (
        <Chip label="Event ended" size="small" sx={{ alignSelf: "flex-start" }} />
      )}

      {canShowEndEventControl && pendingVerificationCount > 0 && (
        <Alert severity="info">
          Verify {pendingVerificationCount} pending participant
          {pendingVerificationCount > 1 ? "s" : ""} before you can end this event.
        </Alert>
      )}
      {canShowEndEventControl && pendingVerificationCount === 0 && (
        <>
          <Button color="error" variant="outlined" size="small" onClick={() => setEndDialogOpen(true)}>
            End event
          </Button>
          <EndEventDialog
            open={endDialogOpen}
            onClose={() => setEndDialogOpen(false)}
            onConfirm={handleConfirmEndEvent}
            isSubmitting={endEventMutation.isPending}
          />
        </>
      )}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable">
        {PARTICIPANT_TABS.map((status) => (
          <Tab
            key={status}
            value={status}
            label={`${REGISTRATION_STATUS_META[status].label} (${stats[status] ?? 0})`}
          />
        ))}
      </Tabs>

      {isLoading && (
        <Stack spacing={1}>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} variant="rounded" height={56} />
          ))}
        </Stack>
      )}

      {isError && <Alert severity="error">Couldn't load participants.</Alert>}

      {!isLoading && !isError && participants.length === 0 && (
        <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
          No one here yet.
        </Typography>
      )}

      {!isLoading && participants.length > 0 && (
        <Box>
          {participants.map((p, i) => (
            <Box key={p.registrationId}>
              <ParticipantRow
                participant={p}
                rateable={tab === "UNDER_VERIFICATION"}
                isSubmitting={pendingUserId === p.userId}
                onSubmitRating={(stars) => handleSubmitRating(p.userId, stars)}
              />
              {i < participants.length - 1 && <Divider />}
            </Box>
          ))}

          {hasNextPage && (
            <Stack alignItems="center" mt={1.5}>
              <Button size="small" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                {isFetchingNextPage ? "Loading…" : "Load more"}
              </Button>
            </Stack>
          )}
        </Box>
      )}
    </Stack>
  );
};

export default ParticipantsPanel;