import { Paper, Typography, Button, Box, Grid } from "@mui/material";

const NGOControls = () => {
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: 2
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          NGO Moderation
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" color="success">
            Approve NGO
          </Button>

          <Button variant="contained" color="error">
            Remove NGO
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
};

export default NGOControls;