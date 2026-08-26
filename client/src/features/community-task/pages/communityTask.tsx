import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Paper,
  Alert,
  Chip,
  Divider,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupsIcon from "@mui/icons-material/Groups";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import toast from "react-hot-toast";

import Header from "../../dashboard/components/Header";
import {
  getCommunityTaskById,
  registerForCommunityTask,
} from "../../../apis/task/community/community.api";

import { type CommunityTaskDetail } from "../../../utils/community.validation";

const GREEN_PRIMARY = "#1b5e20";

export default function CommunityTaskPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<CommunityTaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (!taskId) {
      setLoading(false);
      return;
    }

    const fetchTask = async () => {
      try {
        setLoading(true);
        const data = await getCommunityTaskById(taskId);
        setTask(data);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load task details");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleRegister = async () => {
    if (!taskId) return;
    try {
      setRegistering(true);
      await registerForCommunityTask(taskId);
      toast.success("Successfully registered for this event!");
      
      // Update local state to reflect registration
      setTask((prev) =>
        prev
          ? {
              ...prev,
              isRegistered: true,
              registeredCount: prev.registeredCount + 1,
            }
          : null
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "Not scheduled";
    return new Date(date).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
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
      <Box p={4} textAlign="center">
        <Typography variant="h6" gutterBottom>
          Community Task Not Found
        </Typography>
        <Button
          variant="outlined"
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
            Back to Tasks
          </Button>

          <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              {task.title}
            </Typography>
            <Chip
              icon={<MilitaryTechIcon />}
              label={`${task.baseScore} XP`}
              color="success"
              variant="outlined"
            />
          </Box>

          <Typography variant="body1" color="text.secondary" mb={3}>
            {task.description}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Details Grid */}
          <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={2} mb={4}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <AccessTimeIcon color="action" fontSize="small" />
              <Typography variant="body2">
                <strong>Schedule:</strong> {formatDate(task.startAt)} – {formatDate(task.endAt)}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1.5}>
              <GroupsIcon color="action" fontSize="small" />
              <Typography variant="body2">
                <strong>Capacity:</strong> {task.registeredCount} /{" "}
                {task.maxParticipants ? `${task.maxParticipants} participants` : "Unlimited"}
              </Typography>
            </Box>

            {task.locationName && (
              <Box display="flex" alignItems="center" gap={1.5}>
                <LocationOnIcon color="action" fontSize="small" />
                <Typography variant="body2">
                  <strong>Location:</strong> {task.locationName}
                </Typography>
              </Box>
            )}

            <Box display="flex" alignItems="center" gap={1.5}>
              <Typography variant="body2" color="text.secondary">
                <strong>Organized by:</strong> {task.ngoName} ({task.areaName})
              </Typography>
            </Box>
          </Box>

          {/* Registration / Status Actions */}
          {task.isRegistered ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              You are registered for this event! On the event day, head to the location to check in.
            </Alert>
          ) : task.isFull ? (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This task has reached its maximum participant limit.
            </Alert>
          ) : (
            <Box textAlign="center" mt={4}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Register to participate and earn rewards upon on-site verification.
              </Alert>

              <Button
                variant="contained"
                size="large"
                disabled={registering}
                onClick={handleRegister}
                sx={{
                  bgcolor: GREEN_PRIMARY,
                  px: 6,
                  py: 1.2,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#144a18" },
                }}
              >
                {registering ? <CircularProgress size={24} color="inherit" /> : "Register"}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}