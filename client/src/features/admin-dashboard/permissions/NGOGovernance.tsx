import { useEffect, useState } from "react";
import { Box, Typography, Button, Stack, CircularProgress } from "@mui/material";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

import { getActiveNGOs } from "../../../apis/super-admin/admin.api";
import NGODetailsDialog from "../components/NGODetailsDialog";
import EmptyState from "../shared/components/EmptyState";
import { colors } from "../theme/tokens";

interface NGO {
  id: string;
  name: string;
  area: string;
  members: number;
}

const NGOGovernance = () => {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNGOId, setSelectedNGOId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {
    try {
      const response = await getActiveNGOs(1, 50);
      setNgos(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (ngoId: string) => {
    setSelectedNGOId(ngoId);
    setOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress size={22} sx={{ color: colors.forest }} />
      </Box>
    );
  }

  return (
    <Box>
      {ngos.length === 0 ? (
        <EmptyState icon={GroupsOutlinedIcon} title="No NGOs to govern yet" />
      ) : (
        <Stack spacing={1}>
          {ngos.map((ngo) => (
            <Box
              key={ngo.id}
              sx={{ p: 1.75, border: `0.5px solid ${colors.border}`, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: colors.ink }}>{ngo.name}</Typography>
                <Typography sx={{ fontSize: 12, color: colors.inkMuted }}>{ngo.area} · {ngo.members} members</Typography>
              </Box>
              <Button size="small" onClick={() => handleOpen(ngo.id)} sx={{ textTransform: "none", flexShrink: 0 }}>
                View
              </Button>
            </Box>
          ))}
        </Stack>
      )}

      <NGODetailsDialog ngoId={selectedNGOId} open={open} onClose={() => setOpen(false)} />
    </Box>
  );
};

export default NGOGovernance;