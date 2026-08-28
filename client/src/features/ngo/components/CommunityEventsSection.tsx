// components/ngo/CommunityEventsSection.tsx

import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Grid,
  Skeleton,
  Alert,
  Button,
  Stack,
} from "@mui/material";
import toast from "react-hot-toast";
import { useCommunityTasks } from "../hooks/useCommunityTasks";
import CommunityEventCard from "./CommunityEventCard";
import CommunityEventDetailsDrawer from "./CommunityEventDetailsDrawer";
import { TIMELINE_TABS } from "../utils/taskTimeline";
import type { TaskTimeline } from "../types/communityTasks";

interface Props {
  ngoId: string;
  permissions: string[];
}

const CommunityEventsSection = ({ ngoId, permissions }: Props) => {
  const [timeline, setTimeline] = useState<TaskTimeline>("upcoming");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCommunityTasks(ngoId, timeline);

  if (!permissions.includes("VIEW_ANALYTICS")) return null;

  const tasks = data?.pages.flatMap((page) => page.data) ?? [];
  const canReviewSubmissions = permissions.includes("REVIEW_SUBMISSIONS");

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" mb={2}>
          Community Events
        </Typography>

        <Tabs
          value={timeline}
          onChange={(_, value) => setTimeline(value)}
          sx={{ mb: 2 }}
        >
          {TIMELINE_TABS.map((t) => (
            <Tab key={t.value} value={t.value} label={t.label} />
          ))}
        </Tabs>

        {isLoading && (
          <Grid container spacing={2}>
            {[...Array(3)].map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rounded" height={140} />
              </Grid>
            ))}
          </Grid>
        )}

        {isError && !isLoading && (
          <Alert severity="error">
            {(error as Error)?.message || "Couldn't load community events."}
          </Alert>
        )}

        {!isLoading && !isError && tasks.length === 0 && (
          <Typography variant="body2" color="text.secondary" py={4} textAlign="center">
            No {timeline} events right now.
          </Typography>
        )}

        {!isLoading && tasks.length > 0 && (
          <>
            <Grid container spacing={2}>
              {tasks.map((task) => (
                <Grid key={task.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <CommunityEventCard
                    task={task}
                    timeline={timeline}
                    onClick={() => setSelectedTaskId(task.id)}
                  />
                </Grid>
              ))}
            </Grid>

            {hasNextPage && (
              <Stack alignItems="center" mt={2.5}>
                <Button
                  onClick={() =>
                    fetchNextPage().catch(() =>
                      toast.error("Couldn't load more events")
                    )
                  }
                  disabled={isFetchingNextPage}
                  variant="outlined"
                  size="small"
                >
                  {isFetchingNextPage ? "Loading…" : "Load more"}
                </Button>
              </Stack>
            )}
          </>
        )}
      </CardContent>

      <CommunityEventDetailsDrawer
        open={Boolean(selectedTaskId)}
        onClose={() => setSelectedTaskId(null)}
        ngoId={ngoId}
        taskId={selectedTaskId}
        timeline={selectedTaskId ? timeline : null}
        canReviewSubmissions={canReviewSubmissions}
        canEndEvent={permissions.includes("CREATE_COMMUNITY_TASKS")}
      />
    </Card>
  );
};

export default CommunityEventsSection;