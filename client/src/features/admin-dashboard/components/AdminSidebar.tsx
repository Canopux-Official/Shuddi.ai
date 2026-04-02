import { Box, Typography, List, ListItemButton, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: 240,
        bgcolor: "#0f3d2e",
        color: "white",
        display: "flex",
        flexDirection: "column",
        p: 3
      }}
    >
      <Typography variant="h6" sx={{ mb: 4, fontWeight: 700 }}>
        Shuddi Admin
      </Typography>

      <List>
        <ListItemButton
          sx={{ borderRadius: 2, mb: 1 }}
          onClick={() => navigate("/admin-dashboard")}
        >
          <DashboardIcon sx={{ mr: 2 }} />
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton
          sx={{ borderRadius: 2 }}
          onClick={() => navigate("/admin/control-center")}
        >
          <SettingsIcon sx={{ mr: 2 }} />
          <ListItemText primary="Control Center" />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default AdminSidebar;