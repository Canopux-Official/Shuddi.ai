// src/pages/super-admin/NGODetailsPage.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Chip,
  Stack,
  Divider,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import {
  getNGODetails,
  updateNGOStatus,
  updateApplicationStatus,
} from "../../../apis/super-admin/admin.api";

interface NGOLog {
  id: string;
  action: string;
  details?: string;
  createdAt: string;
}

interface NGODocument {
  id: string;
  type: string;
  url: string;
  uploadedAt: string;
}

const NGODetailsPage = () => {
  const { ngoId } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [ngoData, setNgoData] = useState<any>(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: (() => Promise<void>) | null;
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: null,
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!ngoId) return;

        const response = await getNGODetails(ngoId);

        setNgoData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch NGO details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [ngoId]);

  const openConfirmation = (
    title: string,
    description: string,
    onConfirm: () => Promise<void>
  ) => {
    setConfirmDialog({
      open: true,
      title,
      description,
      onConfirm,
    });
  };

  const closeConfirmation = () => {
    setConfirmDialog((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const refreshData = async () => {
    if (!ngoId) return;

    const response = await getNGODetails(ngoId);

    setNgoData(response.data.data);
  };

  const handleApproveApplication = async () => {
    try {
      if (!ngoId) return;

      setActionLoading(true);

      await updateApplicationStatus(
        ngoId,
        "APPROVED"
      );

      await refreshData();

    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(false);
      closeConfirmation();
    }
  };

  const handleRejectApplication = async () => {
    try {
      if (!ngoId) return;

      setActionLoading(true);

      await updateApplicationStatus(
        ngoId,
        "REJECTED"
      );

      navigate(-1);

    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(false);
      closeConfirmation();
    }
  };

  const handleSuspendNGO = async () => {
    try {
      if (!ngoId) return;

      setActionLoading(true);

      await updateNGOStatus(
        ngoId,
        "SUSPENDED"
      );

      await refreshData();

    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(false);
      closeConfirmation();
    }
  };

  const handleRestoreNGO = async () => {
    try {
      if (!ngoId) return;

      setActionLoading(true);

      await updateNGOStatus(
        ngoId,
        "APPROVED"
      );

      await refreshData();

    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(false);
      closeConfirmation();
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!ngoData) {
    return (
      <Typography>
        NGO details not found
      </Typography>
    );
  }

  const isApplication = ngoData.type === "APPLICATION";

  const data = ngoData.data;

  return (
    <Box>
      <Button
        variant="outlined"
        sx={{ mb: 3 }}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: 3,
        }}
      >
        <Stack spacing={3}>

          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
              >
                {data.name}
              </Typography>

              <Typography color="text.secondary">
                Area: {data.area.name}
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            >
              <Chip
                label={data.status}
                color={
                  data.status === "APPROVED"
                    ? "success"
                    : data.status === "SUSPENDED"
                    ? "error"
                    : "warning"
                }
              />

              {/* Pending Application Buttons */}
              {isApplication && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() =>
                      openConfirmation(
                        "Approve NGO Application",
                        "Are you sure you want to approve this NGO application?",
                        handleApproveApplication
                      )
                    }
                  >
                    Approve
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                      openConfirmation(
                        "Reject NGO Application",
                        "Are you sure you want to reject this NGO application?",
                        handleRejectApplication
                      )
                    }
                  >
                    Reject
                  </Button>
                </>
              )}

              {/* Approved NGO Button */}
              {!isApplication &&
                data.status === "APPROVED" && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                      openConfirmation(
                        "Suspend NGO",
                        "Are you sure you want to suspend this NGO?",
                        handleSuspendNGO
                      )
                    }
                  >
                    Suspend NGO
                  </Button>
                )}

              {/* Suspended NGO Button */}
              {!isApplication &&
                data.status === "SUSPENDED" && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() =>
                      openConfirmation(
                        "Restore NGO",
                        "Are you sure you want to restore this NGO?",
                        handleRestoreNGO
                      )
                    }
                  >
                    Restore NGO
                  </Button>
                )}
            </Stack>
          </Box>

          <Divider />

          {/* General Info */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 3,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  mb={2}
                >
                  General Information
                </Typography>

                <Stack spacing={1}>
                  <Typography>
                    Created At:{" "}
                    {new Date(
                      data.createdAt
                    ).toLocaleString()}
                  </Typography>

                  {!isApplication && (
                    <Typography>
                      Members: {data.memberCount}
                    </Typography>
                  )}

                  {isApplication && (
                    <Typography>
                      Applicant Email:{" "}
                      {data.user.email}
                    </Typography>
                  )}
                </Stack>
              </Paper>
            </Grid>

            {/* Documents */}
            {isApplication && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    mb={2}
                  >
                    Documents
                  </Typography>

                  <Stack spacing={2}>
                    {data.documents.map(
                      (doc: NGODocument) => (
                        <Paper
                          key={doc.id}
                          variant="outlined"
                          sx={{
                            p: 2,
                            borderRadius: 2,
                          }}
                        >
                          <Typography fontWeight={600}>
                            {doc.type}
                          </Typography>

                          <Button
                            variant="outlined"
                            size="small"
                            href={doc.url}
                            target="_blank"
                            sx={{ mt: 1 }}
                          >
                            View Document
                          </Button>
                        </Paper>
                      )
                    )}
                  </Stack>
                </Paper>
              </Grid>
            )}
          </Grid>

          {/* Logs */}
          {!isApplication && (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                mb={3}
              >
                Activity Logs
              </Typography>

              <Stack spacing={2}>
                {data.logs.map((log: NGOLog) => (
                  <Paper
                    key={log.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                    }}
                  >
                    <Typography fontWeight={600}>
                      {log.action}
                    </Typography>

                    {log.details && (
                      <Typography
                        color="text.secondary"
                        mt={0.5}
                      >
                        {log.details}
                      </Typography>
                    )}

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {new Date(
                        log.createdAt
                      ).toLocaleString()}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          )}
        </Stack>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirmation}
      >
        <DialogTitle>
          {confirmDialog.title}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {confirmDialog.description}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeConfirmation}>
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={actionLoading}
            onClick={() =>
              confirmDialog.onConfirm?.()
            }
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NGODetailsPage;