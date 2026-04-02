import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const AdminNavbar = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Shuddi Admin</Typography>

        <Box>
          <Button color="inherit">Dashboard</Button>
          <Button color="inherit">Control Center</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;