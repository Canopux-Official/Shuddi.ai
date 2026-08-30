import { useEffect, useState } from "react";
import { Box, Typography, Stack, Chip, Button, CircularProgress, Pagination } from "@mui/material";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import toast from "react-hot-toast";

import { getPendingVerificationsApi } from "../../../apis/super-admin/admin.api";
import EmptyState from "../shared/components/EmptyState";
import VerificationReviewDialog from "../components/VerificationReviewDialog";
import { colors, withOpacity } from "../theme/tokens";
import type {
  PendingVerificationItem,
  PendingVerificationsResponse,
  VerificationPagination,
} from "../types/verification";

const PAGE_LIMIT = 10;

const confidenceColor = (score: number | null) => {
  if (score === null) return colors.inkMuted;
  if (score < 50) return colors.danger;
  if (score < 70) return colors.accentGold;
  return colors.forestSage;
};

const timeInQueue = (createdAt: string) => {
  const ms = Date.now() - new Date(createdAt).getTime();
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h waiting`;
  const days = Math.floor(hours / 24);
  return `${days}d waiting`;
};

const VerificationControls = () => {
  const [items, setItems] = useState<PendingVerificationItem[]>([]);
  const [pagination, setPagination] = useState<VerificationPagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<PendingVerificationItem | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  const fetchPending = async (targetPage: number) => {
    try {
      setLoading(true);
      const res: PendingVerificationsResponse = await getPendingVerificationsApi(targetPage, PAGE_LIMIT);
      setItems(res.data || []);
      setPagination(res.pagination || null);
    } catch (error) {
      console.error(error);
      toast.error("Couldn't load pending verifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleReview = (item: PendingVerificationItem) => {
    setSelected(item);
    setReviewOpen(true);
  };

  const handleResolved = () => {
    setReviewOpen(false);
    setSelected(null);

    // if the resolved item was the only one left on this page, step back a page
    if (items.length === 1 && page > 1) {
      setPage((p) => p - 1);
    } else {
      fetchPending(page);
    }
  };

  if (loading && items.length === 0) {
    return (
      <Box display="flex" justifyContent="center" py={5}>
        <CircularProgress size={24} sx={{ color: colors.forest }} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography sx={{ fontSize: 13, color: colors.inkMuted, mb: 2 }}>
        Submissions the AI scored between 30–89 — not confident enough to auto-pass or auto-reject. Give each a
        final call.
      </Typography>

      {items.length === 0 ? (
        <EmptyState
          icon={PendingActionsOutlinedIcon}
          title="Nothing waiting on review"
          description="Every AI-uncertain submission has been resolved."
        />
      ) : (
        <Stack spacing={1}>
          {items.map((item) => (
            <Box
              key={item.taskScoreId}
              sx={{
                p: 1.75,
                border: `0.5px solid ${colors.border}`,
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: colors.ink }}>
                    {item.task.title}
                  </Typography>
                  {item.task.verificationType && (
                    <Chip
                      label={item.task.verificationType}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: 10,
                        fontWeight: 500,
                        bgcolor: withOpacity(colors.forest, 0.08),
                        color: colors.forest,
                      }}
                    />
                  )}
                </Stack>
                <Typography sx={{ fontSize: 12, color: colors.inkMuted, mt: 0.25 }} noWrap>
                  {item.user.displayName ?? item.user.username ?? item.user.email}
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 13, color: colors.inkMuted }} />
                  <Typography sx={{ fontSize: 11, color: colors.inkMuted }}>{timeInQueue(item.createdAt)}</Typography>
                </Stack>
              </Box>

              <Stack direction="row" spacing={1.5} alignItems="center" flexShrink={0}>
                <Chip
                  label={`AI ${item.systemScore ?? "—"}`}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: 11,
                    bgcolor: withOpacity(confidenceColor(item.systemScore), 0.12),
                    color: confidenceColor(item.systemScore),
                  }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleReview(item)}
                  sx={{ textTransform: "none", flexShrink: 0 }}
                >
                  Review
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      {pagination && pagination.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={2.5}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={(_, value) => setPage(value)}
            size="small"
            shape="rounded"
            sx={{ "& .Mui-selected": { bgcolor: `${colors.forest} !important`, color: "#fff" } }}
          />
        </Box>
      )}

      <VerificationReviewDialog
        open={reviewOpen}
        item={selected}
        onClose={() => setReviewOpen(false)}
        onResolved={handleResolved}
      />
    </Box>
  );
};

export default VerificationControls;