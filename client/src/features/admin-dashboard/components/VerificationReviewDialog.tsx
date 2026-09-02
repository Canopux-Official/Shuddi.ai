import { useEffect, useState } from "react";
import { Box, Typography, Stack, Chip, Button, TextField, Divider, Grid } from "@mui/material";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import toast from "react-hot-toast";

import { overrideVerificationScoreApi, rejectVerificationApi } from "../../../apis/super-admin/admin.api";
import ControlDialog from "../shared/components/ControlDialog";
import { colors, withOpacity } from "../theme/tokens";
import type { PendingVerificationItem } from "../types/verification";

interface Props {
  open: boolean;
  item: PendingVerificationItem | null;
  onClose: () => void;
  // called after a successful approve/reject so the parent can refetch the queue
  onResolved: () => void;
}

const confidenceColor = (score: number | null) => {
  if (score === null) return colors.inkMuted;
  if (score < 50) return colors.danger;
  if (score < 70) return colors.accentGold;
  return colors.forestSage;
};

const VerificationReviewDialog = ({ open, item, onClose, onResolved }: Props) => {
  const [score, setScore] = useState("");
  const [scoreError, setScoreError] = useState("");
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  // reset the form whenever a new submission is opened for review
  useEffect(() => {
    if (open) {
      setScore(item?.systemScore != null ? String(item.systemScore) : "");
      setScoreError("");
      setReason("");
      setReasonError("");
    }
  }, [open, item]);

  if (!item) return null;

  const busy = approving || rejecting;

  const handleApprove = async () => {
    const trimmed = score.trim();
    const parsed = Number(trimmed);

    if (trimmed === "" || !Number.isInteger(parsed) || parsed < 0 || parsed > 100) {
      setScoreError("Enter a whole number between 0 and 100");
      return;
    }
    setScoreError("");

    try {
      setApproving(true);
      await overrideVerificationScoreApi(item.taskScoreId, parsed);
      toast.success("Score recorded — moved to the reward flow");
      onResolved();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to record score");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      setReasonError("A rejection reason is required");
      return;
    }
    setReasonError("");

    try {
      setRejecting(true);
      await rejectVerificationApi(item.taskScoreId, reason.trim());
      toast.success("Submission rejected");
      onResolved();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to reject submission");
    } finally {
      setRejecting(false);
    }
  };

  return (
    <ControlDialog
      open={open}
      onClose={busy ? () => {} : onClose}
      title="Review submission"
      icon={PendingActionsOutlinedIcon}
      maxWidth="lg"
    >
      <Box>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 1, mb: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 17, fontWeight: 600, color: colors.ink }}>{item.task.title}</Typography>
            <Typography sx={{ fontSize: 12, color: colors.inkMuted, mt: 0.25 }}>
              {item.user.displayName ?? item.user.username ?? "Unnamed user"} · {item.user.email}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
            {item.task.verificationType && (
              <Chip
                label={item.task.verificationType}
                size="small"
                sx={{ height: 22, fontSize: 11, fontWeight: 500, bgcolor: withOpacity(colors.forest, 0.08), color: colors.forest }}
              />
            )}
            <Chip
              label={`AI confidence: ${item.systemScore ?? "—"}`}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: 11,
                bgcolor: withOpacity(confidenceColor(item.systemScore), 0.12),
                color: confidenceColor(item.systemScore),
              }}
            />
          </Stack>
        </Box>

        {item.task.description && (
          <Typography sx={{ fontSize: 13, color: colors.inkMuted, mb: 2 }}>{item.task.description}</Typography>
        )}

        {item.task.rubric && (
          <Box sx={{ p: 1.5, border: `0.5px solid ${colors.border}`, borderRadius: 2, bgcolor: withOpacity(colors.forest, 0.03), mb: 2.5 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: colors.forest, textTransform: "uppercase", letterSpacing: 0.4, mb: 0.5 }}>
              Verification criteria
            </Typography>
            <Typography sx={{ fontSize: 13, color: colors.ink, whiteSpace: "pre-wrap" }}>{item.task.rubric}</Typography>
          </Box>
        )}

        <Divider sx={{ borderColor: colors.border, mb: 2.5 }} />

        {/* Evidence */}
        <Typography sx={{ fontSize: 13, fontWeight: 500, color: colors.ink, mb: 1.5 }}>
          Submitted evidence
          {item.evidence.submittedAt && (
            <Typography component="span" sx={{ fontSize: 12, color: colors.inkMuted, fontWeight: 400, ml: 1 }}>
              · {new Date(item.evidence.submittedAt).toLocaleString()}
            </Typography>
          )}
        </Typography>

        {item.evidence.evidenceUrls.length > 0 && (
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            {item.evidence.evidenceUrls.map((url, i) => {
              // BEFORE_AFTER submissions store exactly two URLs, positionally:
              // [0] = before, [1] = after (see verification.orchestrator.ts).
              // Everything else just gets a generic "Evidence N" label.
              const label =
                item.task.verificationType === "BEFORE_AFTER"
                  ? i === 0
                    ? "Before"
                    : i === 1
                    ? "After"
                    : `Evidence ${i + 1}`
                  : `Evidence ${i + 1}`;

              return (
                <Grid size={{ xs: 6, sm: 4 }} key={url + i}>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: colors.inkMuted, mb: 0.5 }}>
                    {label}
                  </Typography>
                  <Box
                    component="a"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ display: "block", borderRadius: 2, overflow: "hidden", border: `0.5px solid ${colors.border}` }}
                  >
                    <Box
                      component="img"
                      src={url}
                      alt={label}
                      sx={{ width: "100%", height: 140, objectFit: "cover", display: "block", bgcolor: withOpacity(colors.forest, 0.04) }}
                    />
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}

        {item.evidence.textResponse && (
          <Box sx={{ p: 1.5, border: `0.5px solid ${colors.border}`, borderRadius: 2, mb: 2 }}>
            <Typography sx={{ fontSize: 13, color: colors.ink, whiteSpace: "pre-wrap" }}>
              {item.evidence.textResponse}
            </Typography>
          </Box>
        )}

        {item.evidence.evidenceUrls.length === 0 && !item.evidence.textResponse && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 2, color: colors.inkMuted }}>
            <InsertDriveFileOutlinedIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 13 }}>No evidence was attached to this submission.</Typography>
          </Box>
        )}

        <Divider sx={{ borderColor: colors.border, my: 2.5 }} />

        {/* Decision */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ p: 2, border: `0.5px solid ${colors.border}`, borderRadius: 2, height: "100%" }}>
              <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1.5 }}>
                <CheckCircleIcon sx={{ fontSize: 16, color: colors.forestSage }} />
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: colors.ink }}>Approve with a score</Typography>
              </Stack>
              <TextField
                fullWidth
                size="small"
                label="Final score (0–100)"
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                error={!!scoreError}
                helperText={scoreError || "Overwrites the AI's score and moves the task into the reward flow."}
                disabled={busy}
                sx={{ mb: 1.5 }}
                inputProps={{ min: 0, max: 100, step: 1 }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleApprove}
                disabled={busy}
                sx={{ textTransform: "none", fontWeight: 500, bgcolor: colors.forestSage, "&:hover": { bgcolor: colors.forest } }}
              >
                {approving ? "Saving..." : "Approve & score"}
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ p: 2, border: `0.5px solid ${colors.border}`, borderRadius: 2, height: "100%" }}>
              <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1.5 }}>
                <CancelIcon sx={{ fontSize: 16, color: colors.danger }} />
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: colors.ink }}>Reject</Typography>
              </Stack>
              <TextField
                fullWidth
                size="small"
                label="Rejection reason"
                multiline
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                error={!!reasonError}
                helperText={reasonError || "Shown to the user as the reason their submission was rejected."}
                disabled={busy}
                sx={{ mb: 1.5 }}
              />
              <Button
                fullWidth
                variant="outlined"
                onClick={handleReject}
                disabled={busy}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  color: colors.danger,
                  borderColor: colors.danger,
                  "&:hover": { borderColor: colors.danger, bgcolor: withOpacity(colors.danger, 0.06) },
                }}
              >
                {rejecting ? "Rejecting..." : "Reject submission"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ControlDialog>
  );
};

export default VerificationReviewDialog;