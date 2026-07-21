import { useState } from "react";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";

import { usePermissions } from "../hooks/usePermissions";
import { controlPanels } from "./panelsConfig";
import ControlPanelCard from "./ControlPanelCard";
import ControlDialog from "../shared/components/ControlDialog";
import { colors, fonts } from "../theme/tokens";

const ControlCenter = () => {
  const { loading, hasAnyPermission } = usePermissions();
  const [openPanelKey, setOpenPanelKey] = useState<string | null>(null);

  const visiblePanels = controlPanels.filter((panel) => hasAnyPermission(panel.requiredPermissions));
  const activePanel = controlPanels.find((panel) => panel.key === openPanelKey);
  const ActiveComponent = activePanel?.component;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={28} sx={{ color: colors.forest }} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography sx={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 600, color: colors.ink, mb: 0.5 }}>
        Control center
      </Typography>
      <Typography sx={{ fontSize: 14, color: colors.inkMuted, mb: 3 }}>
        Everything you're authorized to manage, in one place.
      </Typography>

      {visiblePanels.length === 0 ? (
        <Typography sx={{ fontSize: 14, color: colors.inkMuted }}>
          You don't have permissions assigned to any control panels yet.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {visiblePanels.map((panel) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={panel.key}>
              <ControlPanelCard
                title={panel.title}
                description={panel.description}
                icon={panel.icon}
                onClick={() => setOpenPanelKey(panel.key)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {activePanel && ActiveComponent && (
        <ControlDialog
          open={!!openPanelKey}
          onClose={() => setOpenPanelKey(null)}
          title={activePanel.title}
          icon={activePanel.icon}
          maxWidth={activePanel.dialogMaxWidth}
        >
          <ActiveComponent />
        </ControlDialog>
      )}
    </Box>
  );
};

export default ControlCenter;