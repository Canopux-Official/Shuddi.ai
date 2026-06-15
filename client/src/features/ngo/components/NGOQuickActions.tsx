// components/ngo/NGOQuickActions.tsx

import {
  Stack,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

interface Props {
  permissions: string[];
  onManageMembers: () => void;
}

const NGOQuickActions = ({
  permissions,
  onManageMembers,
}: Props) => {
  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography
          variant="h6"
          mb={2}
        >
          Quick Actions
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
        >
          {permissions.includes(
            "MANAGE_MEMBERS"
          ) && (
              <Button
                variant="contained"
                onClick={onManageMembers}
              >
                Manage Members
              </Button>
            )}

          {permissions.includes(
            "CREATE_COMMUNITY_TASK"
          ) && (
              <Button
                variant="contained"
              >
                Create Community Task
              </Button>
            )}

          {permissions.includes(
            "CREATE_REWARD"
          ) && (
              <Button
                variant="contained"
              >
                Create Reward
              </Button>
            )}

          {permissions.includes(
            "CREATE_INDIVIDUAL_TASK"
          ) && (
              <Button
                variant="contained"
              >
                Create Individual Task
              </Button>
            )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NGOQuickActions;