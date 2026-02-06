import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Paper,
  Alert
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupsIcon from "@mui/icons-material/Groups";

import Header from "../../dashboard/components/Header";
import { mockAvailableTasks } from '../mock/task.mock';
import type { AvailableCommunityTask } from '../mock/task.mock';


const GREEN_PRIMARY = "#1b5e20";

export default function CommunityTaskPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<AvailableCommunityTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (!taskId) {
      setLoading(false);
      return;
    }

    const foundTask = mockAvailableTasks.items.find(
      (t) => t.communityTaskId === taskId
    );

    setTask(foundTask ?? null);
    setLoading(false);
  }, [taskId]);

  const formatDate = (date?: string) => {
    if (!date) return "Not scheduled";
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress sx={{ color: GREEN_PRIMARY }} />
      </Box>
    );
  }

  if (!task) {
    return (
      <Box p={4}>
        <Typography variant="h6">Community Task Not Found</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/all-tasks")}
        >
          Back to Tasks
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8" }}>
      <Header />

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>

          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/all-tasks")}
            sx={{ mb: 3 }}
          >
            Back
          </Button>

          <Typography variant="h4" fontWeight={800} gutterBottom>
            {task.title}
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={3}>
            {task.description}
          </Typography>

          {/* Schedule */}
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <AccessTimeIcon fontSize="small" />
            <Typography>
              {formatDate(task.startAt)} - {formatDate(task.endAt)}
            </Typography>
          </Box>

          {/* Capacity */}
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <GroupsIcon fontSize="small" />
            <Typography>
              Max Participants: {task.maxParticipants ?? "Unlimited"}
            </Typography>
          </Box>

          {!registered ? (
            <Box textAlign="center">
              <Alert severity="info" sx={{ mb: 3 }}>
                Register to participate in this community initiative.
              </Alert>

              <Button
                variant="contained"
                size="large"
                onClick={() => setRegistered(true)}
                sx={{
                  bgcolor: GREEN_PRIMARY,
                  px: 6,
                  "&:hover": { bgcolor: "#144a18" }
                }}
              >
                Register
              </Button>
            </Box>
          ) : (
            <Alert severity="success">
              Successfully registered for this task.
            </Alert>
          )}

        </Paper>
      </Container>
    </Box>
  );
}
