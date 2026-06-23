import {
  Paper,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";

import { useEffect, useState } from "react";

import { getActiveNGOs } from "../../../apis/super-admin/admin.api";
import NGODetailsDialog from "../components/NGODetailsDialog";

interface NGO {
  id: string;
  name: string;
  area: string;
  members: number;
}

const NGOGovernance = () => {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [selectedNGOId, setSelectedNGOId] =
    useState<string | null>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {
    try {
      const response = await getActiveNGOs(
        1,
        50
      );

      setNgos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpen = (
    ngoId: string
  ) => {
    setSelectedNGOId(ngoId);
    setOpen(true);
  };

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2 }}
        >
          NGO Governance
        </Typography>

        <List dense>
          {ngos.map((ngo) => (
            <ListItem
              key={ngo.id}
              disablePadding
              secondaryAction={
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    handleOpen(
                      ngo.id
                    )
                  }
                >
                  View
                </Button>
              }
            >
              <ListItemButton>
                <ListItemText
                  primary={ngo.name}
                  secondary={`${ngo.area} • ${ngo.members} members`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <NGODetailsDialog
          ngoId={selectedNGOId}
          open={open}
          onClose={() =>
            setOpen(false)
          }
        />
      </Paper>
    </Grid>
  );
};

export default NGOGovernance;