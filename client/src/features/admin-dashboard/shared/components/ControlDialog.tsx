import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { colors, fonts } from "../../theme/tokens";

interface ControlDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg";
}

const ControlDialog = ({ open, onClose, title, icon: Icon, children, maxWidth = "md" }: ControlDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, border: `0.5px solid ${colors.border}` } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `0.5px solid ${colors.border}`,
          py: 2,
          px: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {Icon && <Icon sx={{ fontSize: 20, color: colors.forest }} />}
          <Typography sx={{ fontFamily: fonts.display, fontSize: 18, fontWeight: 600, color: colors.ink }}>
            {title}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="Close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>{children}</DialogContent>
    </Dialog>
  );
};

export default ControlDialog;