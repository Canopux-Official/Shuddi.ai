import { Box, Typography } from "@mui/material";
import { colors } from "../../theme/tokens";

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description?: string;
}

const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 6, textAlign: "center" }}>
      <Icon sx={{ fontSize: 32, color: colors.inkMuted, mb: 1.5 }} />
      <Typography sx={{ fontSize: 14, fontWeight: 500, color: colors.ink, mb: 0.5 }}>{title}</Typography>
      {description && (
        <Typography sx={{ fontSize: 13, color: colors.inkMuted, maxWidth: 320 }}>{description}</Typography>
      )}
    </Box>
  );
};

export default EmptyState;