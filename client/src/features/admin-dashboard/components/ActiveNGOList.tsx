import {
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import type { NGO } from "../types/ngo";

interface ActiveNGOListProps {
  ngos: NGO[];
}

const ActiveNGOList = ({ ngos }: ActiveNGOListProps) => {
  return (
    <Grid container spacing={3}>
      {ngos.map((ngo) => (
        <Grid size={{ xs: 12, md: 6 }} key={ngo.id}>
          <Card>
            <CardContent>

              <Typography variant="h6">
                {ngo.name}
              </Typography>

              <Typography color="text.secondary">
                Area: {ngo.area}
              </Typography>

              <Typography color="text.secondary">
                Members: {ngo.members}
              </Typography>

            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ActiveNGOList;