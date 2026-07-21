import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { navItems } from "../layouts/navConfig";
import { colors, fonts } from "../theme/tokens";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Box
      sx={{
        width: 240,
        flexShrink: 0,
        bgcolor: colors.forest,
        color: "white",
        display: "flex",
        flexDirection: "column",
        p: 3,
      }}
    >
      <Typography sx={{ fontFamily: fonts.display, fontSize: 18, fontWeight: 600, mb: 4, px: 1 }}>
        Shuddi Admin
      </Typography>

      <List sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {navItems.map(({ label, path, icon: Icon }) => {
          const active = pathname === path;
          return (
            <ListItemButton
              key={path}
              onClick={() => navigate(path)}
              sx={{
                borderRadius: 2,
                bgcolor: active ? "rgba(201,151,44,0.16)" : "transparent",
                borderLeft: active ? `3px solid ${colors.accentGold}` : "3px solid transparent",
                "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: active ? colors.accentGold : "rgba(255,255,255,0.85)" }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 500 : 400, color: active ? "white" : "rgba(255,255,255,0.85)" }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
};

export default AdminSidebar;