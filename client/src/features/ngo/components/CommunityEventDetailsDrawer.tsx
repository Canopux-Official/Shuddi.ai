// components/ngo/CommunityEventDetailsDrawer.tsx

import { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Skeleton,
  Alert,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LockClockOutlinedIcon from "@mui/icons-material/LockClockOutlined";
import { useCommunityTaskDetails } from "../hooks/useCommunityTasks";
import RegistrationStatusBreakdown from "./RegistrationStatusBreakdown";
import { TIMELINE_BADGE, formatDateRange } from "../utils/taskTimeline";
import type { TaskTimeline } from "../types/communityTasks";

interface Props {
  open: boolean;
  onClose: () => void;
  ngoId: string;
  taskId: string | null;
  timeline: TaskTimeline | null;
  canReviewSubmissions: boolean;
}

// Placeholder for the future check-in + rating dashboard. Keeping it as its
// own component means the real implementation just replaces this file's
// contents — the drawer, tabs, and permission/timeline gating around it
// don't change.
const ParticipantsPanel = ({ isOngoing }: { isOngoing: boolean }) => (
  <Stack alignItems="center" textAlign="center" spacing={1.5} py={5} color="text.secondary">
    <LockClockOutlinedIcon fontSize="large" />
    <Typography variant="subtitle1" color="text.primary">
      Participant check-in & rating
    </Typography>
    <Typography variant="body2" sx={{ maxWidth: 320 }}>
      {isOngoing
        ? "Coming soon: see who checked in and rate their contribution here."
        : "This opens up once the event goes live."}
    </Typography>
  </Stack>
);

const CommunityEventDetailsDrawer = ({
  open,
  onClose,
  ngoId,
  taskId,
  timeline,
  canReviewSubmissions,
}: Props) => {
  const [tab, setTab] = useState<"overview" | "participants">("overview");
  const { data, isLoading, isError, refetch } = useCommunityTaskDetails(ngoId, taskId);

  const handleClose = () => {
    setTab("overview");
    onClose();
  };

  const badge = timeline ? TIMELINE_BADGE[timeline] : null;

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <Box sx={{ width: { xs: "100vw", sm: 440 }, height: "100%", display: "flex", flexDirection: "column" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" px={2} py={1.5}>
          <Typography variant="h6" noWrap sx={{ pr: 1 }}>
            {data?.title ?? "Event details"}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />

        {canReviewSubmissions && (
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
            <Tab value="overview" label="Overview" />
            <Tab value="participants" label="Participants" />
          </Tabs>
        )}

        <Box sx={{ flex: 1, overflowY: "auto", p: 2.5 }}>
          {isLoading && (
            <Stack spacing={1.5}>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="rounded" height={80} />
            </Stack>
          )}

          {isError && !isLoading && (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={() => refetch()}>
                  Retry
                </Button>
              }
            >
              Couldn't load this event's details.
            </Alert>
          )}

          {data && !isLoading && tab === "overview" && (
            <Stack spacing={2.5}>
              {badge && (
                <Chip
                  label={badge.label}
                  color={badge.color}
                  size="small"
                  sx={{ alignSelf: "flex-start" }}
                />
              )}

              <Typography variant="body2" color="text.secondary">
                {data.startAt && data.endAt
                  ? formatDateRange(data.startAt, data.endAt)
                  : "No dates"}
              </Typography>

              {data.locationName && (
                <Typography variant="body2" color="text.secondary">
                  {data.locationName}
                </Typography>
              )}

              <Typography variant="body1">{data.description}</Typography>

              <Divider />

              <RegistrationStatusBreakdown stats={data.stats} />
            </Stack>
          )}

          {data && !isLoading && tab === "participants" && (
            <ParticipantsPanel isOngoing={timeline === "ongoing"} />
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default CommunityEventDetailsDrawer;