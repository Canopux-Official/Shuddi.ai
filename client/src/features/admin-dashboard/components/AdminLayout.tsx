import { Box } from "@mui/material";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { colors } from "../theme/tokens";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: colors.cream }}>
      <AdminSidebar />
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <AdminTopbar />
        <Box sx={{ p: 4 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;