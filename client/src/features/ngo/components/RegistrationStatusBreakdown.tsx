// components/ngo/RegistrationStatusBreakdown.tsx

import { Box, Chip, Stack, Typography } from "@mui/material";
import { REGISTRATION_STATUSES } from "../types/communityTasks";
import { REGISTRATION_STATUS_META } from "../utils/taskTimeline";

interface Props {
  stats: Record<string, number>;
}

const RegistrationStatusBreakdown = ({ stats }: Props) => {
  const total = REGISTRATION_STATUSES.reduce((sum, status) => sum + (stats[status] ?? 0), 0);

  if (total === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No one has registered for this event yet.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" mb={1}>
        Participants ({total})
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {REGISTRATION_STATUSES.map((status) => {
          const count = stats[status] ?? 0;
          if (count === 0) return null;
          const meta = REGISTRATION_STATUS_META[status];
          return (
            <Chip
              key={status}
              label={`${meta.label}: ${count}`}
              color={meta.color}
              variant="outlined"
              size="small"
            />
          );
        })}
      </Stack>
    </Box>
  );
};

export default RegistrationStatusBreakdown;