import { useEffect, useState } from "react";
import {
  Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, Stack, Chip, IconButton, CircularProgress, InputAdornment, Tabs, Tab,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RestoreIcon from "@mui/icons-material/Restore";
import AddIcon from "@mui/icons-material/Add";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import toast from "react-hot-toast";

import {
  searchTasksApi, createTaskApi, deactivateTaskApi, reactivateTaskApi, getDeactivatedTasksApi,
} from "../../../apis/super-admin/admin.api";
import EmptyState from "../shared/components/EmptyState";
import { colors, withOpacity } from "../theme/tokens";

interface Task {
  id: string;
  title: string;
  description: string;
  type: "INDIVIDUAL" | "COMMUNITY";
}

const initialFormState = {
  title: "", description: "", baseScore: "",
  difficulty: "EASY", category: "SUSTAINABILITY", verificationType: "IMAGE",
  maxParticipants: "", minParticipants: "", locationName: "", city: "", state: "", country: "",
};

type TabKey = "SEARCH" | "DEACTIVATED";

const TaskControls = () => {
  const [tab, setTab] = useState<TabKey>("SEARCH");
  const [search, setSearch] = useState("");

  const [searchedTasks, setSearchedTasks] = useState<Task[]>([]);
  const [deactivatedTasks, setDeactivatedTasks] = useState<Task[]>([]);

  const [loading, setLoading] = useState(false);
  const [deactivatedLoading, setDeactivatedLoading] = useState(false);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [taskType, setTaskType] = useState("INDIVIDUAL");
  const [formData, setFormData] = useState(initialFormState);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await searchTasksApi({ search, page: 1, limit: 10, isActive: true });
      setSearchedTasks(res.data.data.tasks || []);
    } catch (error) {
      console.error(error);
      toast.error("Couldn't load tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchDeactivatedTasks = async () => {
    try {
      setDeactivatedLoading(true);
      const res = await getDeactivatedTasksApi();
      setDeactivatedTasks(res.data.data.tasks || []);
    } catch (error) {
      console.error(error);
    } finally {
      setDeactivatedLoading(false);
    }
  };

  const handleCreateTask = async () => {
    try {
      const payload: any = {
        type: taskType,
        title: formData.title,
        description: formData.description,
        baseScore: Number(formData.baseScore),
      };

      if (taskType === "INDIVIDUAL") {
        payload.difficulty = formData.difficulty;
        payload.category = formData.category;
        payload.verificationType = formData.verificationType;
      }

      if (taskType === "COMMUNITY") {
        payload.maxParticipants = Number(formData.maxParticipants);
        payload.minParticipants = Number(formData.minParticipants);
        payload.locationName = formData.locationName;
        payload.city = formData.city;
        payload.state = formData.state;
        payload.country = formData.country;
      }

      await createTaskApi(payload);
      toast.success("Task created");
      setOpenCreateModal(false);
      setFormData(initialFormState);
      fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create task");
    }
  };

  const handleDeactivateTask = async (taskId: string) => {
    try {
      await deactivateTaskApi(taskId);
      toast.success("Task deactivated");
      fetchTasks();
      fetchDeactivatedTasks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to deactivate task");
    }
  };

  const handleReactivateTask = async (taskId: string) => {
    try {
      await reactivateTaskApi(taskId);
      toast.success("Task reactivated");
      fetchTasks();
      fetchDeactivatedTasks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to reactivate task");
    }
  };

  useEffect(() => {
    fetchDeactivatedTasks();
  }, []);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1.5 }}>
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          sx={{ minHeight: 36, "& .MuiTab-root": { minHeight: 36, textTransform: "none", fontSize: 13 } }}
        >
          <Tab label="Search" value="SEARCH" />
          <Tab label={`Deactivated (${deactivatedTasks.length})`} value="DEACTIVATED" />
        </Tabs>

        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon fontSize="small" />}
          onClick={() => setOpenCreateModal(true)}
          sx={{ textTransform: "none", fontWeight: 500, bgcolor: colors.forest, "&:hover": { bgcolor: colors.forestSage } }}
        >
          Create task
        </Button>
      </Box>

      {tab === "SEARCH" && (
        <Box>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by title or description"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18 }} /></InputAdornment> }}
            />
            <Button variant="outlined" size="small" onClick={fetchTasks} sx={{ textTransform: "none", flexShrink: 0 }}>
              Search
            </Button>
          </Stack>

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress size={22} sx={{ color: colors.forest }} />
            </Box>
          ) : searchedTasks.length === 0 ? (
            <EmptyState icon={TaskAltOutlinedIcon} title="No tasks found" description="Search results will appear here." />
          ) : (
            <Stack spacing={1}>
              {searchedTasks.map((task) => (
                <Box
                  key={task.id}
                  sx={{ p: 1.75, border: `0.5px solid ${colors.border}`, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography sx={{ fontSize: 14, fontWeight: 500, color: colors.ink }}>{task.title}</Typography>
                      <Chip
                        label={task.type}
                        size="small"
                        sx={{
                          bgcolor: withOpacity(task.type === "COMMUNITY" ? colors.accentGold : colors.forest, 0.12),
                          color: task.type === "COMMUNITY" ? colors.accentGold : colors.forest,
                          fontSize: 11,
                          fontWeight: 500,
                        }}
                      />
                    </Stack>
                    <Typography sx={{ fontSize: 12, color: colors.inkMuted, mt: 0.25 }} noWrap>
                      {task.description}
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={() => handleDeactivateTask(task.id)} sx={{ color: colors.danger, flexShrink: 0 }} aria-label="Deactivate task">
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      )}

      {tab === "DEACTIVATED" && (
        <Box>
          {deactivatedLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress size={22} sx={{ color: colors.forest }} />
            </Box>
          ) : deactivatedTasks.length === 0 ? (
            <EmptyState icon={TaskAltOutlinedIcon} title="No deactivated tasks" description="All tasks are currently active." />
          ) : (
            <Stack spacing={1}>
              {deactivatedTasks.map((task) => (
                <Box
                  key={task.id}
                  sx={{ p: 1.75, border: `0.5px solid ${colors.border}`, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, color: colors.ink }}>{task.title}</Typography>
                    <Typography sx={{ fontSize: 12, color: colors.inkMuted, mt: 0.25 }} noWrap>
                      {task.description}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    startIcon={<RestoreIcon fontSize="small" />}
                    onClick={() => handleReactivateTask(task.id)}
                    sx={{ textTransform: "none", flexShrink: 0, color: colors.forestSage }}
                  >
                    Reactivate
                  </Button>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      )}

      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontFamily: "'Lora', serif", fontWeight: 600 }}>Create new task</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField select label="Task type" value={taskType} onChange={(e) => setTaskType(e.target.value)}>
              <MenuItem value="INDIVIDUAL">Individual</MenuItem>
              <MenuItem value="COMMUNITY">Community</MenuItem>
            </TextField>

            <TextField label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            <TextField label="Description" multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            <TextField label="Base score" type="number" value={formData.baseScore} onChange={(e) => setFormData({ ...formData, baseScore: e.target.value })} />

            {taskType === "INDIVIDUAL" && (
              <>
                <TextField select label="Difficulty" value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}>
                  <MenuItem value="EASY">Easy</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HARD">Hard</MenuItem>
                </TextField>
                <TextField select label="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <MenuItem value="SUSTAINABILITY">Sustainability</MenuItem>
                  <MenuItem value="EDUCATION">Education</MenuItem>
                  <MenuItem value="COMMUNITY">Community</MenuItem>
                </TextField>
                <TextField select label="Verification type" value={formData.verificationType} onChange={(e) => setFormData({ ...formData, verificationType: e.target.value })}>
                  <MenuItem value="IMAGE">Image</MenuItem>
                  <MenuItem value="TEXT">Text</MenuItem>
                  <MenuItem value="MCQ">MCQ</MenuItem>
                  <MenuItem value="HYBRID">Hybrid</MenuItem>
                </TextField>
              </>
            )}

            {taskType === "COMMUNITY" && (
              <>
                <TextField label="Max participants" type="number" value={formData.maxParticipants} onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })} />
                <TextField label="Min participants" type="number" value={formData.minParticipants} onChange={(e) => setFormData({ ...formData, minParticipants: e.target.value })} />
                <TextField label="Location name" value={formData.locationName} onChange={(e) => setFormData({ ...formData, locationName: e.target.value })} />
                <TextField label="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} helperText="Under construction" />
                <TextField label="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                <TextField label="Country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
              </>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenCreateModal(false)} sx={{ textTransform: "none" }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateTask}
            sx={{ textTransform: "none", bgcolor: colors.forest, "&:hover": { bgcolor: colors.forestSage } }}
          >
            Create task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskControls;