import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Stack,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import { getNGOModerationData } from "../../../apis/super-admin/admin.api";

interface NGOItem {
  id: string;
  name: string;
  status: string;
  createdAt: string;

  area: {
    id: string;
    name: string;
  };
}

interface PendingApplication {
  id: string;
  name: string;
  createdAt: string;

  user: {
    id: string;
    email: string;
  };

  area: {
    id: string;
    name: string;
  };
}

const NGOControls = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [activeNGOs, setActiveNGOs] = useState<NGOItem[]>([]);
  const [suspendedNGOs, setSuspendedNGOs] = useState<NGOItem[]>([]);
  const [pendingApplications, setPendingApplications] = useState<
    PendingApplication[]
  >([]);

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
      <Grid size={{ xs: 12 }}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Paper>
      </Grid>
    );
  }

  const renderNGOCard = (
    ngo: NGOItem | PendingApplication,
    type: "ACTIVE" | "SUSPENDED" | "PENDING"
  ) => (
    <Paper
      key={ngo.id}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack spacing={1}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography fontWeight={600}>
            {ngo.name}
          </Typography>

          <Chip
            label={type}
            color={
              type === "ACTIVE"
                ? "success"
                : type === "SUSPENDED"
                ? "error"
                : "warning"
            }
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary">
          Area: {ngo.area.name}
        </Typography>

        {"user" in ngo && (
          <Typography variant="body2" color="text.secondary">
            Applicant: {ngo.user.email}
          </Typography>
        )}

        <Typography variant="caption" color="text.secondary">
          {new Date(ngo.createdAt).toLocaleDateString()}
        </Typography>

        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 1 }}
          onClick={() =>
            navigate(`/super-admin/ngo/${ngo.id}`)
          }
        >
          View Details
        </Button>
      </Stack>
    </Paper>
  );

  return (
    <Grid size={{ xs: 12 }}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: 700,
          }}
        >
          NGO Moderation
        </Typography>

        <Stack spacing={4}>
          {/* Active NGOs */}
          <Box>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600 }}
            >
              Active NGOs
            </Typography>

            <Grid container spacing={2}>
              {activeNGOs.length > 0 ? (
                activeNGOs.map((ngo) =>
                  renderNGOCard(ngo, "ACTIVE")
                )
              ) : (
                <Typography color="text.secondary">
                  No active NGOs found
                </Typography>
              )}
            </Grid>
          </Box>

          <Divider />

          {/* Pending Applications */}
          <Box>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600 }}
            >
              Pending Applications
            </Typography>

            <Grid container spacing={2}>
              {pendingApplications.length > 0 ? (
                pendingApplications.map((ngo) =>
                  renderNGOCard(ngo, "PENDING")
                )
              ) : (
                <Typography color="text.secondary">
                  No pending applications
                </Typography>
              )}
            </Grid>
          </Box>

          <Divider />

          {/* Suspended NGOs */}
          <Box>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600 }}
            >
              Suspended NGOs
            </Typography>

            <Grid container spacing={2}>
              {suspendedNGOs.length > 0 ? (
                suspendedNGOs.map((ngo) =>
                  renderNGOCard(ngo, "SUSPENDED")
                )
              ) : (
                <Typography color="text.secondary">
                  No suspended NGOs
                </Typography>
              )}
            </Grid>
          </Box>
        </Stack>
      </Paper>
    </Grid>
  );
};

export default NGOControls;