import { useEffect, useState } from "react";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";

import NGOControls from "../permissions/NGOControls";
import TaskControls from "../permissions/TaskControls";
import RewardControls from "../permissions/RewardControls";
import MemberControls from "../permissions/MemberControls";
import CommunityControls from "../permissions/CommunityControls";
import AreaControls from "../permissions/AreaControls";

import { getAdminPermissions } from "../../../apis/super-admin/admin.api"; // your api call

const ControlCenter = () => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await getAdminPermissions();

        // your response structure:
        // { success: true, data: [...] }


        setPermissions(response.data);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const hasAnyPermission = (requiredPermissions: string[]) =>
    requiredPermissions.some((perm) =>
      permissions.includes(perm)
    );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Control Center
      </Typography>

      <Grid container spacing={3}>
        {hasAnyPermission(["NGO_APPROVE", "NGO_REMOVE"]) && (
          <NGOControls />
        )}

        {hasAnyPermission([
          "TASK_CREATE",
          "TASK_VERIFY",
          "TASK_DELETE",
        ]) && <TaskControls />}

        {hasAnyPermission([
          "REWARD_CREATE",
          "REWARD_EDIT",
          "REWARD_DELETE",
        ]) && <RewardControls />}

        {hasAnyPermission([
          "MEMBER_INVITE",
          "MEMBER_REMOVE",
        ]) && <MemberControls />}

        {hasAnyPermission([
          "COMMUNITY_MODERATE",
        ]) && <CommunityControls />}

        {hasAnyPermission([
          "AREA_CREATE",
        ]) && <AreaControls />}
      </Grid>
    </Box>
  );
};

export default ControlCenter;