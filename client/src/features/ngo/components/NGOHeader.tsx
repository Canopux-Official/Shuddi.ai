// components/ngo/NGOHeader.tsx

import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
} from "@mui/material";

const NGOHeader = ({
  dashboard,
}: any) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography
          variant="h4"
          fontWeight={700}
        >
          {dashboard.ngo.name}
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          mt={2}
        >
          <Chip
            label={
              dashboard.ngo.area.name
            }
          />

          <Chip
            color="success"
            label={
              dashboard.ngo.status
            }
          />

          <Chip
            color="primary"
            label={
              dashboard.membership.role
            }
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NGOHeader;