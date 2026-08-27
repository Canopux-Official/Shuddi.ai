import { useState, useEffect, useCallback } from "react";
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
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupsIcon from "@mui/icons-material/Groups";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import toast from "react-hot-toast";

import {
  getCommunityTaskById,
  registerForCommunityTask,
  checkInToCommunityTask,
} from "../../../apis/task/community/community.api";

import {
  type CommunityTaskDetail,
  type RegistrationStatus,
} from "../../../utils/community.validation";
import {
  getCurrentPosition,
  GeolocationError,
} from "../utils/geolocation.util";

const GREEN_PRIMARY = "#1b5e20";

const STEP_LABELS = [
  "Registered",
  "Check-In Pending",
  "Under Verification",
  "Rewarded",
];

/**
 * Maps the registration status + whether the event has started yet to a
 * step index for the Stepper, and to a color/label for the status chip.
 */
function getPipelineState(
  status: RegistrationStatus | null | undefined,
  eventStarted: boolean
): { activeStep: number; chipLabel: string; chipColor: "default" | "success" | "warning" | "info" | "error" } {
  if (status === "REJECTED") {
    return { activeStep: 2, chipLabel: "Check-In Rejected", chipColor: "error" };
  }
  if (status === "COMPLETED") {
    return { activeStep: 3, chipLabel: "Rewarded", chipColor: "success" };
  }
  if (status === "UNDER_VERIFICATION" || status === "SUBMITTED") {
    return { activeStep: 2, chipLabel: "Under Verification", chipColor: "info" };
  }
  if (status === "REGISTERED" && eventStarted) {
    return { activeStep: 1, chipLabel: "Check-In Pending", chipColor: "warning" };
  }
  return { activeStep: 0, chipLabel: "Registered", chipColor: "default" };
}

export default function CommunityTaskPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<CommunityTaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  // Check-in flow state
  const [geoDialogOpen, setGeoDialogOpen] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Ticks every 30s so the "has the event started" check re-evaluates
  // without requiring the user to refresh the page.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const fetchTask = useCallback(async () => {
    if (!taskId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getCommunityTaskById(taskId);
      setTask(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load task details");
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const handleRegister = async () => {
    if (!taskId) return;

    try {
      setRegistering(true);

      await registerForCommunityTask(taskId);

      toast.success("Successfully registered for this event!");

      setTask((prev) =>
        prev
          ? {
              ...prev,
              isRegistered: true,
              registrationStatus: "REGISTERED",
              registeredCount: prev.registeredCount + 1,
            }
          : null
      );
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setTask((prev) =>
          prev
            ? {
                ...prev,
                isRegistered: true,
                registrationStatus: prev.registrationStatus ?? "REGISTERED",
              }
            : null
        );

        toast.success("You are already registered for this event!");
      } else {
        toast.error(error?.response?.data?.message || "Registration failed");
      }
    } finally {
      setRegistering(false);
    }
  };

  // Step 1 of check-in: user taps "I'm Here". We never call the
  // geolocation API directly from here — we first show the onboarding
  // dialog so the permission prompt is requested with context, and the
  // actual browser prompt fires from a click inside that dialog (still
  // a user gesture, so browsers won't block it).
  const handleCheckInTap = () => {
    setGeoError(null);
    setGeoDialogOpen(true);
  };

  // Step 2: user confirms inside the dialog. This click is what actually
  // triggers the native GPS permission prompt on first use.
  const handleConfirmLocationAndCheckIn = async () => {
    if (!taskId) return;

    setGeoError(null);
    setCheckingIn(true);

    try {
      const position = await getCurrentPosition();

      const result = await checkInToCommunityTask(
        taskId,
        position.latitude,
        position.longitude
      );

      toast.success(result.message || "Checked in successfully!");
      setGeoDialogOpen(false);

      setTask((prev) =>
        prev ? { ...prev, registrationStatus: "UNDER_VERIFICATION" } : null
      );
    } catch (error: any) {
      if (error instanceof GeolocationError) {
        setGeoError(error.message);
      } else {
        setGeoError(
          error?.response?.data?.message ||
            error?.normalizedMessage ||
            "Check-in failed. Please try again."
        );
      }
    } finally {
      setCheckingIn(false);
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

  const eventStarted = !!task.startAt && now >= new Date(task.startAt);
  const eventEnded = !!task.endAt && now > new Date(task.endAt);
  const { activeStep, chipLabel, chipColor } = getPipelineState(
    task.registrationStatus,
    eventStarted
  );

  const showCheckInButton =
    task.isRegistered &&
    task.registrationStatus === "REGISTERED" &&
    eventStarted &&
    !eventEnded;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8" }}>
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
            <Box mt={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" fontWeight={700}>
                  Your Status
                </Typography>
                <Chip label={chipLabel} color={chipColor} size="small" />
              </Stack>

              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                {STEP_LABELS.map((label) => (
                  <Step key={label}>
                    <StepLabel error={task.registrationStatus === "REJECTED" && label === "Under Verification"}>
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              {task.registrationStatus === "REGISTERED" && !eventStarted && (
                <Alert severity="success" icon={<CheckCircleIcon fontSize="inherit" />}>
                  You're registered for this event! Come back once it starts on{" "}
                  {formatDate(task.startAt)} to check in on-site.
                </Alert>
              )}

              {task.registrationStatus === "REGISTERED" && eventStarted && eventEnded && (
                <Alert severity="warning">
                  This event's check-in window has closed. If you attended but
                  weren't able to check in, please contact the organizing NGO.
                </Alert>
              )}

              {showCheckInButton && (
                <Box textAlign="center" mt={3}>
                  <Alert severity="info" sx={{ mb: 3, textAlign: "left" }}>
                    This event is live! Tap the button below when you're on-site
                    to confirm your attendance.
                  </Alert>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<MyLocationIcon />}
                    onClick={handleCheckInTap}
                    sx={{
                      bgcolor: GREEN_PRIMARY,
                      px: 6,
                      py: 1.2,
                      fontWeight: 600,
                      "&:hover": { bgcolor: "#144a18" },
                    }}
                  >
                    I'm Here — Check In
                  </Button>
                </Box>
              )}

              {(task.registrationStatus === "UNDER_VERIFICATION" ||
                task.registrationStatus === "SUBMITTED") && (
                <Alert severity="info" icon={<HourglassTopIcon fontSize="inherit" />}>
                  You've checked in! The organizing NGO is verifying your
                  attendance — your reward will be credited once approved.
                </Alert>
              )}

              {task.registrationStatus === "COMPLETED" && (
                <Alert severity="success" icon={<EmojiEventsIcon fontSize="inherit" />}>
                  Verified and rewarded! You've earned {task.baseScore} XP for
                  this event. Thank you for participating.
                </Alert>
              )}

              {task.registrationStatus === "REJECTED" && (
                <Alert severity="error">
                  Your check-in for this event couldn't be verified. Reach out
                  to the organizing NGO if you believe this is a mistake.
                </Alert>
              )}
            </Box>
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

      {/* Geolocation onboarding + confirmation dialog. Dismissible; the
          actual native permission prompt only fires when the user taps
          the confirm button below, so we never surprise them with a
          browser prompt out of nowhere. */}
      <Dialog
        open={geoDialogOpen}
        onClose={() => !checkingIn && setGeoDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm your location</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            To check in, we need to verify you're on-site. When you tap
            "Enable Location & Check In", your browser will ask for
            permission to share your GPS location — this is only used once,
            right now, to confirm your attendance.
          </DialogContentText>

          {geoError && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {geoError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setGeoDialogOpen(false)} disabled={checkingIn}>
            Not Now
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmLocationAndCheckIn}
            disabled={checkingIn}
            startIcon={
              checkingIn ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <MyLocationIcon />
              )
            }
            sx={{
              bgcolor: GREEN_PRIMARY,
              "&:hover": { bgcolor: "#144a18" },
            }}
          >
            {checkingIn ? "Checking In..." : "Enable Location & Check In"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}