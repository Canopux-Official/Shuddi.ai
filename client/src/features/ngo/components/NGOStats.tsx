// components/ngo/NGOStats.tsx

import {
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const StatCard = ({
  title,
  value,
}: {
  title: string;
  value: number;
}) => (
  <Card>
    <CardContent>
      <Typography
        color="text.secondary"
      >
        {title}
      </Typography>

      <Typography
        variant="h4"
        fontWeight={700}
      >
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const NGOStats = ({
  stats,
}: any) => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 3 }}>
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <StatCard
          title="Active Members"
          value={stats.activeMembers}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <StatCard
          title="Community Tasks"
          value={
            stats.totalCommunityTasks
          }
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <StatCard
          title="Active Tasks"
          value={
            stats.activeCommunityTasks
          }
        />
      </Grid>
    </Grid>
  );
};

export default NGOStats;