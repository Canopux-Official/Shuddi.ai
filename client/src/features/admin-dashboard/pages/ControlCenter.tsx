import { Box, Typography, Grid } from "@mui/material";
import NGOControls from "../permissions/NGOControls";
import TaskControls from "../permissions/TaskControls";
import RewardControls from "../permissions/RewardControls";
import MemberControls from "../permissions/MemberControls";
import CommunityControls from "../permissions/CommunityControls";
import { adminPermissions } from "../data/permissions";

const ControlCenter = () => {
  const hasPermission = (perm: string) =>
    adminPermissions.includes(perm);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Control Center
      </Typography>

      <Grid container spacing={3}>
        {hasPermission("NGO_APPROVE") && <NGOControls />}
        {hasPermission("TASK_CREATE") && <TaskControls />}
        {hasPermission("REWARD_CREATE") && <RewardControls />}
        {hasPermission("MEMBER_INVITE") && <MemberControls />}
        {hasPermission("COMMUNITY_MODERATE") && <CommunityControls />}
      </Grid>
    </Box>
  );
};

export default ControlCenter;