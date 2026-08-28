import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

const EndEventDialog = ({ open, onClose, onConfirm, isSubmitting }: Props) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>End this event?</DialogTitle>
    <DialogContent>
      <DialogContentText>
        This closes the event and automatically rejects anyone still Registered or Under
        Verification as a no-show. This can't be undone.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button color="error" variant="contained" onClick={onConfirm} disabled={isSubmitting}>
        {isSubmitting ? "Ending…" : "End event"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default EndEventDialog;