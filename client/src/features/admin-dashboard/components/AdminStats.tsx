import { Card, CardContent, Typography, Grid } from "@mui/material";

const stats = [
  { title: "Pending NGOs", value: 4 },
  { title: "Active NGOs", value: 12 },
  { title: "Total Members", value: 86 }
];

const AdminStats = () => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {stats.map((stat) => (
        <Grid size={{ xs: 12, md: 4 }} key={stat.title}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary">
                {stat.title}
              </Typography>

              <Typography variant="h4" fontWeight={700}>
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AdminStats;