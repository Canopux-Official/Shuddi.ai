import { Paper, Typography, Button, Grid, Box, List, ListItem, ListItemText } from "@mui/material";
import { dummyData } from "../data/adminDummyData";

const MemberControls = () => {
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Member Governance
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button variant="contained">Invite Member</Button>
          <Button color="error" variant="outlined">
            Remove Member
          </Button>
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Active Members
        </Typography>

        <List dense>
          {dummyData.members.map((member) => (
            <ListItem key={member.id}>
              <ListItemText
                primary={member.name}
                secondary={member.role}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Grid>
  );
};

export default MemberControls;