import { Paper, Box, Typography } from "@mui/material";
import { colors, fonts } from "../../theme/tokens";

interface SectionCardProps {
  title: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
  children: React.ReactNode;
}

const SectionCard = ({ title, icon: Icon, action, children }: SectionCardProps) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {Icon && <Icon sx={{ fontSize: 18, color: colors.forest }} />}
          <Typography sx={{ fontFamily: fonts.display, fontSize: 17, fontWeight: 600, color: colors.ink }}>
            {title}
          </Typography>
        </Box>
        {action}
      </Box>
      {children}
    </Paper>
  );
};

export default SectionCard;