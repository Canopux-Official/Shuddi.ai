import { Box, Typography } from "@mui/material";

const AdminTopbar = () => {
  return (
    <Box
      sx={{
        height: 70,
        bgcolor: "white",
        display: "flex",
        alignItems: "center",
        px: 4,
        borderBottom: "1px solid #e5e7eb"
      }}
    >
      <Typography variant="h5" fontWeight={600}>
        Admin Dashboard
      </Typography>
    </Box>
  );
};

export default AdminTopbar;