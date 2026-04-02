import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  Stack,
  CardMedia
} from "@mui/material";
import type { NGORequest } from "../types/ngo";

interface NGORequestDetailsProps {
  open: boolean;
  onClose: (ngo: NGORequest) => void;
  request: NGORequest | null;
}

const NGORequestDetails = ({ open, onClose, request }: NGORequestDetailsProps) => {
  if (!request) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{request.name}</DialogTitle>

      <DialogContent>

        <Typography variant="subtitle1">
          Owner: {request.owner}
        </Typography>

        <Typography variant="subtitle2">
          Area: {request.area}
        </Typography>

        <Typography sx={{ mt: 2 }}>
          {request.description}
        </Typography>

        <Stack spacing={2} sx={{ mt: 3 }}>
          {request.documents.map((doc, i) => (
            <CardMedia
              key={i}
              component="img"
              height="200"
              image={doc}
            />
          ))}
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button variant="contained" color="success">
            Approve
          </Button>

          <Button variant="contained" color="error">
            Reject
          </Button>
        </Stack>

      </DialogContent>
    </Dialog>
  );
};

export default NGORequestDetails;