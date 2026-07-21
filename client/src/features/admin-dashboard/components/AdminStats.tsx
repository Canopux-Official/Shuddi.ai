import { useEffect, useState } from "react";
import { Grid, Typography, CircularProgress, Box } from "@mui/material";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

import StatCard from "../shared/components/StatCard";
import { colors } from "../theme/tokens";
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
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getPlatformStatsApi();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch platform stats", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={28} sx={{ color: colors.forest }} />
      </Box>
    );
  }

  if (error || !stats) {
    return (
      <Typography sx={{ color: colors.danger, fontSize: 14 }}>
        Couldn't load platform statistics. Try refreshing the page.
      </Typography>
    );
  }

  // Config-driven: add a new stat by adding an entry here, nothing else changes.
  const cards = [
    {
      title: "Pending NGOs",
      value: stats.pendingNGOs,
      icon: PendingActionsOutlinedIcon,
      accentColor: colors.danger,
    },
    {
      title: "Active NGOs",
      value: stats.activeNGOs,
      icon: CheckCircleOutlineIcon,
      accentColor: colors.forestSage,
      ring: { current: stats.activeNGOs, total: stats.totalNGOs },
    },
    {
      title: "Total members",
      value: stats.totalMembers,
      icon: GroupsOutlinedIcon,
      accentColor: colors.forest,
    },
    {
      title: "Total users",
      value: stats.totalUsers,
      icon: PersonOutlineIcon,
      accentColor: colors.forest,
    },
    {
      title: "Completed tasks",
      value: stats.completedTasks,
      icon: TaskAltOutlinedIcon,
      accentColor: colors.accentGold,
      ring: { current: stats.completedTasks, total: stats.totalTasks },
    },
    {
      title: "Areas covered",
      value: stats.totalAreas,
      icon: MapOutlinedIcon,
      accentColor: colors.forest,
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {cards.map((card) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.title}>
          <StatCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
};

export default AdminStats;