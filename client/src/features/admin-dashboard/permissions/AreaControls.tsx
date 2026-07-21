import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import toast from "react-hot-toast";

import { createArea, getPendingAreaRequests } from "../../../apis/super-admin/admin.api";
import EmptyState from "../shared/components/EmptyState";
import { colors } from "../theme/tokens";

interface PendingAreaRequest {
  id: string;
  name: string;
  requestCount: number;
}

const AreaControls = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [nameError, setNameError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<PendingAreaRequest[]>([]);

  const fetchPendingRequests = async () => {
    try {
      const data = await getPendingAreaRequests();
      setPendingRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const validateForm = () => {
    let isValid = true;
    setNameError("");
    setCodeError("");

    if (!name.trim()) {
      setNameError("Area name is required");
      isValid = false;
    }
    if (!code.trim()) {
      setCodeError("Area code is required");
      isValid = false;
    } else if (code.trim().length < 3) {
      setCodeError("Area code must be at least 3 characters");
      isValid = false;
    }
    return isValid;
  };

  const handleCreateArea = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      await createArea({ name: name.trim(), code: code.trim() });
      await fetchPendingRequests();
      setName("");
      setCode("");
      toast.success("Area created");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create area");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography sx={{ fontSize: 13, fontWeight: 500, color: colors.ink, mb: 1.5 }}>Pending area requests</Typography>

      {pendingRequests.length === 0 ? (
        <EmptyState icon={MapOutlinedIcon} title="No pending area requests" />
      ) : (
        <Stack spacing={1} sx={{ mb: 3 }}>
          {pendingRequests.map((request) => (
            <Box
              key={request.id}
              sx={{ p: 1.5, border: `0.5px solid ${colors.border}`, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}
            >
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: colors.ink }}>{request.name}</Typography>
                <Typography sx={{ fontSize: 12, color: colors.inkMuted }}>
                  {request.requestCount} user{request.requestCount > 1 ? "s" : ""} waiting
                </Typography>
              </Box>
              <Button
                size="small"
                onClick={() => {
                  setName(request.name);
                  setNameError("");
                }}
                sx={{ textTransform: "none", flexShrink: 0 }}
              >
                Prefill
              </Button>
            </Box>
          ))}
        </Stack>
      )}

      <Stack spacing={2}>
        <TextField label="Area name" fullWidth size="small" value={name} onChange={(e) => setName(e.target.value)} error={!!nameError} helperText={nameError} />
        <TextField label="Area code" fullWidth size="small" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} error={!!codeError} helperText={codeError} />
        <Button
          variant="contained"
          onClick={handleCreateArea}
          disabled={loading}
          sx={{ textTransform: "none", fontWeight: 500, bgcolor: colors.forest, "&:hover": { bgcolor: colors.forestSage }, alignSelf: "flex-start", px: 3 }}
        >
          {loading ? "Creating..." : "Create area"}
        </Button>
      </Stack>
    </Box>
  );
};

export default AreaControls;