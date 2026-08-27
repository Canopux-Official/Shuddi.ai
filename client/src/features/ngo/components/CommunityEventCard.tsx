// components/ngo/CommunityEventCard.tsx

import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import type { CommunityTaskListItem, TaskTimeline } from "../types/communityTasks";
import { TIMELINE_BADGE, formatDateRange } from "../utils/taskTimeline";

interface Props {
  task: CommunityTaskListItem;
  timeline: TaskTimeline;
  onClick: () => void;
}

const CommunityEventCard = ({ task, timeline, onClick }: Props) => {
  const badge = TIMELINE_BADGE[timeline];

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardActionArea onClick={onClick} sx={{ height: "100%", p: 0.5 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ pr: 1 }}>
              {task.title}
            </Typography>
            <Chip label={badge.label} color={badge.color} size="small" />
          </Stack>

          <Typography variant="body2" color="text.secondary" mb={1.5}>
            {formatDateRange(task.startAt, task.endAt)}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" color="text.secondary">
            {task.locationName && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <PlaceOutlinedIcon fontSize="small" />
                <Typography variant="body2">{task.locationName}</Typography>
              </Stack>
            )}
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PeopleAltOutlinedIcon fontSize="small" />
              <Typography variant="body2">{task.totalRegistrations} registered</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CommunityEventCard;