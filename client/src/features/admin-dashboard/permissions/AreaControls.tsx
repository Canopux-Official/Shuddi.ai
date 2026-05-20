import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";

import { createArea } from "../../../apis/super-admin/admin.api";

const AreaControls = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const [nameError, setNameError] = useState("");
  const [codeError, setCodeError] = useState("");

  const [loading, setLoading] = useState(false);

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
            onChange={(e) => setCode(e.target.value)}
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