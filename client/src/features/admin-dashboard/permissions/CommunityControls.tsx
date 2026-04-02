import { Paper, Typography, Button, Grid, Box, List, ListItem, ListItemText } from "@mui/material";
import { dummyData } from "../data/adminDummyData";

const CommunityControls = () => {
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Community Moderation
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button variant="contained">Review Reports</Button>
          <Button color="error" variant="outlined">
            Remove Content
          </Button>
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Recent Reports
        </Typography>

        <List dense>
          {dummyData.communityReports.map((report) => (
            <ListItem key={report.id}>
              <ListItemText
                primary={report.issue}
                secondary={report.status}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Grid>
  );
};

export default CommunityControls;