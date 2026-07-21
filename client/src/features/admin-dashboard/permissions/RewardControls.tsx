import { useState } from "react";
import { Box, Typography, Button, TextField, Chip, Divider, Grid, Stack } from "@mui/material";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import StarsIcon from "@mui/icons-material/Stars";
import toast from "react-hot-toast";

import { createRewardApi, type CreateRewardPayload } from "../../../apis/super-admin/admin.api";
import { colors, fonts, withOpacity } from "../theme/tokens";

const initialState = { name: "", description: "", credits: "", icon: "" };

interface CreatedReward {
  name: string;
  description: string;
  credits: number;
}

const RewardControls = () => {
  const [formData, setFormData] = useState(initialState);
  const [createdReward, setCreatedReward] = useState<CreatedReward | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      toast.success("Reward created");
      setFormData(initialState);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create reward");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: createdReward ? 7 : 12 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Reward name" name="name" fullWidth size="small" value={formData.name} onChange={handleChange} />
          <TextField label="Description" name="description" multiline rows={3} fullWidth size="small" value={formData.description} onChange={handleChange} />
          <Stack direction="row" spacing={2}>
            <TextField label="Credits required" name="credits" type="number" fullWidth size="small" value={formData.credits} onChange={handleChange} />
            <TextField label="Icon URL" name="icon" fullWidth size="small" value={formData.icon} onChange={handleChange} />
          </Stack>
          <Button
            variant="contained"
            onClick={handleCreateReward}
            disabled={loading}
            sx={{ textTransform: "none", fontWeight: 500, bgcolor: colors.forest, "&:hover": { bgcolor: colors.forestSage }, alignSelf: "flex-start", px: 3 }}
          >
            {loading ? "Creating..." : "Create reward"}
          </Button>
        </Box>
      </Grid>

      {createdReward && (
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ border: `0.5px solid ${colors.border}`, borderRadius: 3, p: 2.5, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
              <CardGiftcardOutlinedIcon sx={{ fontSize: 28, color: colors.forestSage }} />
              <Box>
                <Typography sx={{ fontFamily: fonts.display, fontSize: 15, fontWeight: 600, color: colors.ink }}>
                  {createdReward.name}
                </Typography>
                <Typography sx={{ fontSize: 12, color: colors.inkMuted }}>Newly created reward</Typography>
              </Box>
            </Box>
            <Divider sx={{ mb: 1.5, borderColor: colors.border }} />
            <Typography sx={{ fontSize: 13, color: colors.ink, lineHeight: 1.6, mb: 2 }}>{createdReward.description}</Typography>
            <Chip
              icon={<StarsIcon sx={{ fontSize: 15 }} />}
              label={`${createdReward.credits} credits`}
              sx={{ bgcolor: withOpacity(colors.accentGold, 0.14), color: colors.accentGold, fontWeight: 500 }}
            />
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default RewardControls;