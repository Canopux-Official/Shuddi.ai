// components/CreateCommunityTaskDialog.tsx

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getAreas } from "../../../apis/ngo/applyNGO";
import { createCommunityTask } from "../../../apis/task/community/community.api";
import type { NGOArea } from "../../../apis/ngo/applyNGO";
import LocationPicker from "./LocationPicker";

import {
  communityTaskSchema,
  type CommunityTaskFormData,
} from "../../../utils/community.validation";
// Roles that are allowed to create a community task in an area other
// than their own NGO's — mirrors the check in createCommunityTask (service).
const AREA_OVERRIDE_ROLES = ["ADMIN", "SUPER_ADMIN"];

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  ngoId: string;
  ngoAreaId: string;
  ngoAreaName: string;
  userRole: string;
}

type FormState = Partial<Record<keyof CommunityTaskFormData, string | number>>;

const emptyForm: FormState = {
  title: "",
  description: "",
  baseScore: "",
  startAt: "",
  endAt: "",
  maxParticipants: "",
  minParticipants: "",
  locationName: "",
  latitude: "",     // Added
  longitude: "",    // Added
  radiusMeters: 100 // Added default
};

const CreateCommunityTaskDialog = ({
  open,
  onClose,
  onSuccess,
  ngoId,
  ngoAreaId,
  ngoAreaName,
  userRole,
}: Props) => {
  const canOverrideArea = AREA_OVERRIDE_ROLES.includes(userRole);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [areaId, setAreaId] = useState(ngoAreaId);
  const [areas, setAreas] = useState<NGOArea[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    // Reset to a clean form every time the dialog opens.
    setForm(emptyForm);
    setAreaId(ngoAreaId);
    setErrors({});

    if (canOverrideArea) {
      getAreas()
        .then(setAreas)
        .catch(() => toast.error("Failed to load areas"));
    }
  }, [open, ngoAreaId, canOverrideArea]);

  const handleChange =
    (field: keyof CommunityTaskFormData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
      };

  const handleSubmit = async () => {
    const candidate = {
      ...form,
      areaId,
      ngoId,
    };

    const result = communityTaskSchema.safeParse(candidate);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      await createCommunityTask({
        ...result.data,
        // Convert local datetime-local values to ISO before sending.
        startAt: result.data.startAt
          ? new Date(result.data.startAt).toISOString()
          : undefined,
        endAt: result.data.endAt
          ? new Date(result.data.endAt).toISOString()
          : undefined,
      });

      toast.success("Community task created");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to create community task");
    } finally {
      setSubmitting(false);
    }
  };

  // Handler for the map updates
  const handleLocationChange = (lat: number, lng: number, radius: number) => {
    setForm((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      radiusMeters: radius,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Community Task</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} mt={0.5}>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Title"
              value={form.title}
              onChange={handleChange("title")}
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Description"
              value={form.description}
              onChange={handleChange("description")}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Base Score"
              value={form.baseScore}
              onChange={handleChange("baseScore")}
              error={!!errors.baseScore}
              helperText={errors.baseScore}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Location"
              value={form.locationName}
              onChange={handleChange("locationName")}
              error={!!errors.locationName}
              helperText={errors.locationName}
            />
          </Grid>

          <Grid size={12}>
            <LocationPicker 
              lat={form.latitude as number | undefined} 
              lng={form.longitude as number | undefined} 
              radius={(form.radiusMeters as number) || 100}
              onChange={handleLocationChange} 
            />
            {errors.latitude && (
              <Typography color="error" variant="caption">
                Please pin a location on the map.
              </Typography>
            )}
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="datetime-local"
              label="Start"
              InputLabelProps={{ shrink: true }}
              value={form.startAt}
              onChange={handleChange("startAt")}
              error={!!errors.startAt}
              helperText={errors.startAt}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="datetime-local"
              label="End"
              InputLabelProps={{ shrink: true }}
              value={form.endAt}
              onChange={handleChange("endAt")}
              error={!!errors.endAt}
              helperText={errors.endAt}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Min Participants"
              value={form.minParticipants}
              onChange={handleChange("minParticipants")}
              error={!!errors.minParticipants}
              helperText={errors.minParticipants}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Max Participants"
              value={form.maxParticipants}
              onChange={handleChange("maxParticipants")}
              error={!!errors.maxParticipants}
              helperText={errors.maxParticipants}
            />
          </Grid>

          <Grid size={12}>
            {canOverrideArea ? (
              <TextField
                select
                fullWidth
                label="Area"
                value={areaId}
                onChange={(e) => setAreaId(e.target.value)}
                error={!!errors.areaId}
                helperText={errors.areaId}
              >
                {areas.map((area) => (
                  <MenuItem key={area.id} value={area.id}>
                    {area.name}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                fullWidth
                label="Area"
                value={ngoAreaName}
                disabled
                helperText="Community tasks are created in your NGO's own area"
              />
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCommunityTaskDialog;