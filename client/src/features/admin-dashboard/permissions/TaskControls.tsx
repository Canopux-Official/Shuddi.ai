import { Paper, Typography, Button, Grid, Box } from "@mui/material";

const TaskControls = () => {
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Task Governance
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained">Create Task</Button>
          <Button variant="outlined">Verify Task</Button>
          <Button color="error" variant="outlined">
            Delete Task
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
};

export default TaskControls;