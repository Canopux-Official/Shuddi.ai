import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material"

type Props = {
  open: boolean
  onClose: () => void
}

export function DialogBox ({ open, onClose }: Props) {
  const [content, setContent] = useState("")

  const handleSubmit = () => {
    if (!content.trim()) return

    // later → call createFeedPost(content)
    console.log("Post content:", content)

    setContent("")
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create a Post</DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          multiline
          minRows={4}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          Post
        </Button>
      </DialogActions>
    </Dialog>
  )
}