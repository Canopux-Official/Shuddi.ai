import { useState } from "react";
import { Avatar, Box, Button, Chip, Rating, Stack, Typography } from "@mui/material";
import type { Participant } from "../types/communityTasks";
import { REGISTRATION_STATUS_META } from "../utils/taskTimeline";

interface Props {
  participant: Participant;
  rateable: boolean;
  onSubmitRating: (stars: number) => void;
  isSubmitting: boolean;
}

const ParticipantRow = ({ participant, rateable, onSubmitRating, isSubmitting }: Props) => {
  const [stars, setStars] = useState<number | null>(null);
  const meta = REGISTRATION_STATUS_META[participant.status];

  return (
    <Stack direction="row" alignItems="center" spacing={2} py={1.5}>
      <Avatar src={participant.avatarUrl ?? undefined}>{participant.displayName[0]}</Avatar>

      <Box flex={1} minWidth={0}>
        <Typography variant="body2" fontWeight={500} noWrap>
          {participant.displayName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {participant.checkInTime
            ? `Checked in ${new Date(participant.checkInTime).toLocaleTimeString()}`
            : "Not checked in"}
        </Typography>
      </Box>

      {rateable ? (
        <Stack direction="row" spacing={1} alignItems="center">
          <Rating
            size="small"
            value={stars}
            onChange={(_, value) => setStars(value)}
            disabled={isSubmitting}
          />
          <Button
            size="small"
            variant="contained"
            disabled={!stars || isSubmitting}
            onClick={() => stars && onSubmitRating(stars)}
          >
            {isSubmitting ? "Saving…" : "Verify"}
          </Button>
        </Stack>
      ) : (
        <Chip label={meta.label} color={meta.color} size="small" variant="outlined" />
      )}
    </Stack>
  );
};

export default ParticipantRow;