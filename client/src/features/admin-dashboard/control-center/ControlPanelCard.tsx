import { Box, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { colors, withOpacity } from "../theme/tokens";

interface ControlPanelCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
}

const ControlPanelCard = ({ title, description, icon: Icon, onClick }: ControlPanelCardProps) => {
  return (
    <Box
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        p: 2.5,
        bgcolor: colors.surface,
        border: `0.5px solid ${colors.border}`,
        borderRadius: 3,
        height: "100%",
        cursor: "pointer",
        transition: "border-color 0.15s ease, transform 0.15s ease",
        "&:hover": { borderColor: colors.forestSage, transform: "translateY(-1px)" },
        "&:focus-visible": { outline: `2px solid ${colors.accentGold}`, outlineOffset: 2 },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          bgcolor: withOpacity(colors.forest, 0.08),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 20, color: colors.forest }} />
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 500, color: colors.ink, mb: 0.5 }}>{title}</Typography>
        <Typography sx={{ fontSize: 13, color: colors.inkMuted, lineHeight: 1.5 }}>{description}</Typography>
      </Box>

      <ChevronRightIcon sx={{ fontSize: 18, color: colors.inkMuted, flexShrink: 0, mt: 0.5 }} />
    </Box>
  );
};

export default ControlPanelCard;