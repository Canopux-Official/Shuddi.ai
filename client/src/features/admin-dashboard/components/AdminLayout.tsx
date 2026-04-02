import { Box } from "@mui/material";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5fdf9" }}>
      <AdminSidebar />

      <Box sx={{ flexGrow: 1 }}>
        <AdminTopbar />

        <Box sx={{ p: 4 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;