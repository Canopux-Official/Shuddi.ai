import { useEffect, useState } from "react";
import { Box, Typography, Chip, Stack, Button, CircularProgress, Tabs, Tab } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";

import { getNGOModerationData } from "../../../apis/super-admin/admin.api";
import EmptyState from "../shared/components/EmptyState";
import { colors, withOpacity } from "../theme/tokens";

interface NGOItem {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  area: { id: string; name: string };
}

interface PendingApplication {
  id: string;
  name: string;
  createdAt: string;
  user: { id: string; email: string };
  area: { id: string; name: string };
}

type TabKey = "ACTIVE" | "PENDING" | "SUSPENDED";

const statusStyles: Record<TabKey, { label: string; color: string }> = {
  ACTIVE: { label: "Active", color: colors.forestSage },
  PENDING: { label: "Pending", color: colors.accentGold },
  SUSPENDED: { label: "Suspended", color: colors.danger },
};

const NGOControls = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>("ACTIVE");

  const [activeNGOs, setActiveNGOs] = useState<NGOItem[]>([]);
  const [suspendedNGOs, setSuspendedNGOs] = useState<NGOItem[]>([]);
  const [pendingApplications, setPendingApplications] = useState<PendingApplication[]>([]);

  useEffect(() => {
    const fetchModerationData = async () => {
      try {
        const response = await getNGOModerationData();
        const data = response.data;
        setActiveNGOs(data.approvedNGOs || []);
        setSuspendedNGOs(data.suspendedNGOs || []);
        setPendingApplications(data.pendingApplications || []);
      } catch (error) {
        console.error("Failed to fetch NGO moderation data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModerationData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={5}>
        <CircularProgress size={24} sx={{ color: colors.forest }} />
      </Box>
    );
  }

  const lists: Record<TabKey, (NGOItem | PendingApplication)[]> = {
    ACTIVE: activeNGOs,
    PENDING: pendingApplications,
    SUSPENDED: suspendedNGOs,
  };
  const currentList = lists[tab];

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        sx={{ mb: 2, minHeight: 36, "& .MuiTab-root": { minHeight: 36, textTransform: "none", fontSize: 13 } }}
      >
        <Tab label={`Active (${activeNGOs.length})`} value="ACTIVE" />
        <Tab label={`Pending (${pendingApplications.length})`} value="PENDING" />
        <Tab label={`Suspended (${suspendedNGOs.length})`} value="SUSPENDED" />
      </Tabs>

      {currentList.length === 0 ? (
        <EmptyState icon={BusinessOutlinedIcon} title={`No ${statusStyles[tab].label.toLowerCase()} NGOs`} />
      ) : (
        <Stack spacing={1}>
          {currentList.map((ngo) => (
            <Box
              key={ngo.id}
              sx={{
                p: 1.75,
                border: `0.5px solid ${colors.border}`,
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: colors.ink }}>{ngo.name}</Typography>
                <Typography sx={{ fontSize: 12, color: colors.inkMuted }}>
                  {ngo.area.name}
                  {"user" in ngo ? ` · ${ngo.user.email}` : ""} · {new Date(ngo.createdAt).toLocaleDateString()}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
                <Chip
                  label={statusStyles[tab].label}
                  size="small"
                  sx={{ bgcolor: withOpacity(statusStyles[tab].color, 0.12), color: statusStyles[tab].color, fontWeight: 500, fontSize: 11 }}
                />
                <Button size="small" onClick={() => navigate(`/super-admin/ngo/${ngo.id}`)} sx={{ textTransform: "none", fontSize: 12 }}>
                  View
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default NGOControls;