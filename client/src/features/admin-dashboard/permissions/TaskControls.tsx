import {
  Paper,
  Typography,
  Button,
  Grid,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Stack,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  CircularProgress,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RestoreIcon from "@mui/icons-material/Restore";
import AddIcon from "@mui/icons-material/Add";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

import { useEffect, useState } from "react";

import {
  searchTasksApi,
  createTaskApi,
  deactivateTaskApi,
  reactivateTaskApi,
  getDeactivatedTasksApi,
} from "../../../apis/super-admin/admin.api";

const TaskControls = () => {
  const [search, setSearch] = useState("");

  const [searchedTasks, setSearchedTasks] = useState<any[]>([]);
  const [deactivatedTasks, setDeactivatedTasks] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [deactivatedLoading, setDeactivatedLoading] = useState(false);

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [taskType, setTaskType] = useState("INDIVIDUAL");

  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    baseScore: "",

    difficulty: "EASY",
    category: "SUSTAINABILITY",
    verificationType: "IMAGE",

    maxParticipants: "",
    minParticipants: "",
    locationName: "",
    city: "",
    state: "",
    country: "",
  });

  // =========================
  // SEARCH TASKS
  // =========================

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await searchTasksApi({
        search,
        page: 1,
        limit: 10,
        isActive: true,
      });

      setSearchedTasks(res.data.data.tasks || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DEACTIVATED TASKS
  // =========================

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

  // =========================
  // CREATE TASK
  // =========================

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

      setOpenCreateModal(false);

      setFormData({
        title: "",
        description: "",
        baseScore: "",

        difficulty: "EASY",
        category: "SUSTAINABILITY",
        verificationType: "IMAGE",

        maxParticipants: "",
        minParticipants: "",
        locationName: "",
        city: "",
        state: "",
        country: "",
      });

      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // DEACTIVATE TASK
  // =========================

  const handleDeactivateTask = async (taskId: string) => {
    try {
      await deactivateTaskApi(taskId);

      fetchTasks();
      fetchDeactivatedTasks();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // REACTIVATE TASK
  // =========================

  const handleReactivateTask = async (taskId: string) => {
    try {
      await reactivateTaskApi(taskId);

      fetchTasks();
      fetchDeactivatedTasks();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDeactivatedTasks();
  }, []);

  return (
    <Grid size={{ xs: 12 }}>
      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: 3,
          border: "1px solid #e5e7eb",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700 }}
            >
              Task Governance
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Manage task creation, visibility, and lifecycle.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateModal(true)}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Create Task
          </Button>
        </Box>

        {/* SEARCH */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: "#f8fafc",
            border: "1px solid #e2e8f0",
            mb: 4,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, mb: 2 }}
          >
            Search Tasks
          </Typography>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
          >
            <TextField
              fullWidth
              placeholder="Search by title or description"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              onClick={fetchTasks}
              sx={{
                minWidth: 140,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Search
            </Button>
          </Stack>
        </Paper>

        {/* SEARCH RESULTS */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Search Results
          </Typography>

          <Paper
            variant="outlined"
            sx={{ borderRadius: 3 }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 6,
                }}
              >
                <CircularProgress />
              </Box>
            ) : searchedTasks.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 6,
                  px: 2,
                }}
              >
                <TaskAltIcon
                  sx={{
                    fontSize: 50,
                    color: "text.secondary",
                    mb: 1,
                  }}
                />

                <Typography variant="h6">
                  No Tasks Found
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Search results will appear here.
                </Typography>
              </Box>
            ) : (
              <List>
                {searchedTasks.map((task, index) => (
                  <Box key={task.id}>
                    <ListItem
                      sx={{ py: 2 }}
                      secondaryAction={
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleDeactivateTask(task.id)
                          }
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            <Typography
                              sx={{ fontWeight: 600 }}
                            >
                              {task.title}
                            </Typography>

                            <Chip
                              label={task.type}
                              size="small"
                              color={
                                task.type === "COMMUNITY"
                                  ? "secondary"
                                  : "primary"
                              }
                            />
                          </Box>
                        }
                        secondary={task.description}
                      />
                    </ListItem>

                    {index !== searchedTasks.length - 1 && (
                      <Divider />
                    )}
                  </Box>
                ))}
              </List>
            )}
          </Paper>
        </Box>

        {/* DEACTIVATED TASKS */}
        <Box>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Deactivated Tasks
          </Typography>

          <Paper
            variant="outlined"
            sx={{ borderRadius: 3 }}
          >
            {deactivatedLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 6,
                }}
              >
                <CircularProgress />
              </Box>
            ) : deactivatedTasks.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 6,
                  px: 2,
                }}
              >
                <Typography variant="h6">
                  No Deactivated Tasks
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  All tasks are currently active.
                </Typography>
              </Box>
            ) : (
              <List>
                {deactivatedTasks.map((task, index) => (
                  <Box key={task.id}>
                    <ListItem
                      sx={{ py: 2 }}
                      secondaryAction={
                        <Button
                          variant="outlined"
                          color="success"
                          startIcon={<RestoreIcon />}
                          onClick={() =>
                            handleReactivateTask(task.id)
                          }
                          sx={{ textTransform: "none" }}
                        >
                          Reactivate
                        </Button>
                      }
                    >
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            <Typography
                              sx={{ fontWeight: 600 }}
                            >
                              {task.title}
                            </Typography>

                            <Chip
                              label="INACTIVE"
                              size="small"
                              color="error"
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={task.description}
                      />
                    </ListItem>

                    {index !==
                      deactivatedTasks.length - 1 && (
                        <Divider />
                      )}
                  </Box>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </Paper>

      {/* CREATE TASK MODAL */}
      <Dialog
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Task</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="Task Type"
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
            >
              <MenuItem value="INDIVIDUAL">
                Individual
              </MenuItem>

              <MenuItem value="COMMUNITY">
                Community
              </MenuItem>
            </TextField>

            <TextField
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
            />

            <TextField
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />

            <TextField
              label="Base Score"
              type="number"
              value={formData.baseScore}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  baseScore: e.target.value,
                })
              }
            />

            {taskType === "INDIVIDUAL" && (
              <>
                <TextField
                  select
                  label="Difficulty"
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      difficulty: e.target.value,
                    })
                  }
                >
                  <MenuItem value="EASY">Easy</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HARD">Hard</MenuItem>
                </TextField>

                <TextField
                  select
                  label="Category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
                    })
                  }
                >
                  <MenuItem value="SUSTAINABILITY">
                    Sustainability
                  </MenuItem>

                  <MenuItem value="EDUCATION">
                    Education
                  </MenuItem>

                  <MenuItem value="COMMUNITY">
                    Community
                  </MenuItem>
                </TextField>

                <TextField
                  select
                  label="Verification Type"
                  value={formData.verificationType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      verificationType: e.target.value,
                    })
                  }
                >
                  <MenuItem value="IMAGE">Image</MenuItem>

                  <MenuItem value="TEXT">Text</MenuItem>

                  <MenuItem value="MCQ">MCQ</MenuItem>

                  <MenuItem value="HYBRID">Hybrid</MenuItem>
                </TextField>
              </>
            )}

            {/* Removed city state and all, added ngoId and areaId, so need to populate ngos who would supervise the task. */}
            {taskType === "COMMUNITY" && (
              <>
                <TextField
                  label="Max Participants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxParticipants: e.target.value,
                    })
                  }
                />

                <TextField
                  label="Min Participants"
                  type="number"
                  value={formData.minParticipants}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minParticipants: e.target.value,
                    })
                  }
                />

                <TextField
                  label="Location Name"
                  value={formData.locationName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      locationName: e.target.value,
                    })
                  }
                />

                <TextField
                  label="Don't fill, Under Construction"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      city: e.target.value,
                    })
                  }
                />

                <TextField
                  label="State"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      state: e.target.value,
                    })
                  }
                />

                <TextField
                  label="Country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      country: e.target.value,
                    })
                  }
                />
              </>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenCreateModal(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreateTask}
            sx={{ textTransform: "none" }}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default TaskControls;