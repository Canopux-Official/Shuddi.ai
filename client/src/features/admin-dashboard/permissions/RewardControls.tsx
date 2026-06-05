import {
  Paper,
  Typography,
  Button,
  Grid,
  Box,
  TextField,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";

import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import StarsIcon from "@mui/icons-material/Stars";

import { useState } from "react";
import toast from "react-hot-toast";

import {
  createRewardApi,
  type CreateRewardPayload,
} from "../../../apis/super-admin/admin.api";

const initialState = {
  name: "",
  description: "",
  credits: "",
  icon: "",
};

const RewardControls = () => {
  const [formData, setFormData] = useState(initialState);

  const [createdReward, setCreatedReward] =
    useState<any>(null);

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateReward = async () => {
    try {
      setLoading(true);

      const payload: CreateRewardPayload = {
        name: formData.name,
        description: formData.description,
        credits: Number(formData.credits),
        icon: formData.icon,
      };

      const response = await createRewardApi(payload);

      setCreatedReward(response.data);

      toast.success("Reward created successfully");

      setFormData(initialState);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create reward"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid size={{ xs: 12 }}>
      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: 3,
          background:
            "linear-gradient(to bottom right, #ffffff, #f8fafc)",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ mb: 1 }}
        >
          Reward Governance
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Create and manage eco-rewards for citizens
          participating in sustainability initiatives.
        </Typography>

        <Grid container spacing={4}>
          {/* FORM SECTION */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <TextField
                label="Reward Name"
                name="name"
                fullWidth
                value={formData.name}
                onChange={handleChange}
              />

              <TextField
                label="Description"
                name="description"
                multiline
                rows={4}
                fullWidth
                value={formData.description}
                onChange={handleChange}
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Credits Required"
                    name="credits"
                    type="number"
                    fullWidth
                    value={formData.credits}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Icon URL"
                    name="icon"
                    fullWidth
                    value={formData.icon}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              <Button
                variant="contained"
                size="large"
                onClick={handleCreateReward}
                disabled={loading}
                sx={{
                  borderRadius: 3,
                  py: 1.4,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                {loading
                  ? "Creating Reward..."
                  : "Create Reward"}
              </Button>
            </Box>
          </Grid>

          {/* PREVIEW SECTION */}
          {createdReward && (
            <Grid size={{ xs: 12, md: 5 }}>
              <Card
                sx={{
                  borderRadius: 4,
                  height: "100%",
                  boxShadow: 2,
                  border: "1px solid #e2e8f0",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <CardGiftcardIcon
                      sx={{
                        fontSize: 40,
                        color: "#16a34a",
                      }}
                    />

                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                      >
                        {createdReward.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Newly Created Reward
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Typography
                    variant="body2"
                    sx={{
                      mb: 3,
                      lineHeight: 1.7,
                    }}
                  >
                    {createdReward.description}
                  </Typography>

                  <Chip
                    icon={<StarsIcon />}
                    label={`${createdReward.credits} Credits`}
                    color="success"
                    sx={{
                      fontWeight: 600,
                      px: 1,
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Grid>
  );
};

export default RewardControls;