import { Paper, Typography, Button, Grid, Box, List, ListItem, ListItemText } from "@mui/material";
import { dummyData } from "../data/adminDummyData";

const RewardControls = () => {
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Reward Governance
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button variant="contained">Create Reward</Button>
          <Button variant="outlined">Edit Reward</Button>
          <Button color="error" variant="outlined">
            Delete Reward
          </Button>
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Recent Rewards
        </Typography>

        <List dense>
          {dummyData.rewards.map((reward) => (
            <ListItem key={reward.id}>
              <ListItemText
                primary={reward.name}
                secondary={`${reward.points} points • ${reward.status}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Grid>
  );
};

export default RewardControls;