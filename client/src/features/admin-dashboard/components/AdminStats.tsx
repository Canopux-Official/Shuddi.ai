import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";

import { getPlatformStatsApi } from "../../../apis/super-admin/admin.api";

interface PlatformStats {
  totalUsers: number;
  activeUsers: number;

  totalNGOs: number;
  activeNGOs: number;
  pendingNGOs: number;
  suspendedNGOs: number;

  totalAreas: number;

  totalTasks: number;
  activeTasks: number;

  completedTasks: number;

  totalCommunityTasks: number;

  totalMembers: number;
}

const AdminStats = () => {
  const [stats, setStats] = useState<PlatformStats | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getPlatformStatsApi();
        setStats(data);
      } catch (error) {
        console.error(
          "Failed to fetch platform stats",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Grid container justifyContent="center">
        <CircularProgress />
      </Grid>
    );
  }

  if (!stats) {
    return (
      <Typography color="error">
        Failed to load statistics.
      </Typography>
    );
  }

  const cards = [
    {
      title: "Pending NGOs",
      value: stats.pendingNGOs,
    },
    {
      title: "Active NGOs",
      value: stats.activeNGOs,
    },
    {
      title: "Total Members",
      value: stats.totalMembers,
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
    },
    {
      title: "Completed Tasks",
      value: stats.completedTasks,
    },
    {
      title: "Areas Covered",
      value: stats.totalAreas,
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cards.map((card) => (
        <Grid
          size={{ xs: 12, sm: 6, md: 4 }}
          key={card.title}
        >
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary">
                {card.title}
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
              >
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AdminStats;