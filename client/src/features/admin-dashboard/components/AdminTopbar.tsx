import { Box, Typography, Avatar } from "@mui/material";
import { useLocation } from "react-router-dom";
import { navItems } from "../layouts/navConfig";
import { colors } from "../theme/tokens";

const AdminTopbar = ({ adminName = "Super admin" }: { adminName?: string }) => {
  const { pathname } = useLocation();
  const current = navItems.find((item) => item.path === pathname);
  const initials = adminName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Box
      sx={{
        height: 64,
        bgcolor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 4,
        borderBottom: `0.5px solid ${colors.border}`,
      }}
    >
      <Typography sx={{ fontSize: 15, color: colors.inkMuted }}>
        Admin{current ? <> / <Box component="span" sx={{ color: colors.ink }}>{current.label}</Box></> : null}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar sx={{ width: 30, height: 30, bgcolor: "#e1efe6", color: colors.forest, fontSize: 12, fontWeight: 500 }}>
          {initials}
        </Avatar>
        <Typography sx={{ fontSize: 13, color: colors.ink }}>{adminName}</Typography>
      </Box>
    </Box>
  );
};

export default AdminTopbar;