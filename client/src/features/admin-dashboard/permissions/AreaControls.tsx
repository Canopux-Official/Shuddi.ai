import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";

import {
  createArea,
  getPendingAreaRequests,
} from "../../../apis/super-admin/admin.api";

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
  const [pendingRequests, setPendingRequests] = useState<
    PendingAreaRequest[]
  >([]);

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

      await createArea({
        name: name.trim(),
        code: code.trim(),
      });

      await fetchPendingRequests();

      setName("");
      setCode("");

      alert("Area created successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to create area");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ minWidth: 320 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Area Management
        </Typography>

        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Pending Area Requests
        </Typography>

        {pendingRequests.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, mb: 3 }}
          >
            No pending area requests.
          </Typography>
        ) : (
          <List sx={{ mb: 3 }}>
            {pendingRequests.map((request, index) => (
              <Box key={request.id}>
                <ListItem
                  secondaryAction={
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setName(request.name);
                        setNameError("");
                      }}
                    >
                      Create
                    </Button>
                  }
                >
                  <ListItemText
                    primary={request.name}
                    secondary={`${request.requestCount} user${
                      request.requestCount > 1 ? "s" : ""
                    } waiting`}
                  />
                </ListItem>

                {index !== pendingRequests.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}

        <Stack spacing={2}>
          <TextField
            label="Area Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!nameError}
            helperText={nameError}
          />

          <TextField
            label="Area Code"
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            error={!!codeError}
            helperText={codeError}
          />

          <Button
            variant="contained"
            onClick={handleCreateArea}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Area"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AreaControls;