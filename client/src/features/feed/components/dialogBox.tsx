import { useState } from "react"

import { Dialog, DialogContent, DialogActions, Button, TextField, Stack, Typography, Avatar, Divider, CircularProgress, Box,  Snackbar, Alert } from "@mui/material"

import { createFeedPost } from "../../../apis/feed/feed"



type Props = {
  open: boolean
  onClose: () => void
}

const MAX_LENGTH = 100



export function DialogBox({ open, onClose }: Props) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim() || loading) return

    try {
      setLoading(true)
      await createFeedPost(content.trim())      // Comment it for now -> Test it after user registeration. 
      console.log("Creating feed post with content:", content.trim())  
      setContent("")
      onClose()
      setSuccessOpen(true)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={loading ? undefined : onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2,
            background: "linear-gradient(135deg, #1976d2, #42a5f5)",
            color: "white",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: "white", color: "primary.main" }}>
              📝
            </Avatar>
            <Typography variant="h6" fontWeight={700}>
              Create Post
            </Typography>
          </Stack>
        </Box>

        <DialogContent sx={{ px: 3, pt: 3 }}>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={5}
            placeholder="Share something valuable with the community…"
            value={content}
            onChange={(e) =>
              setContent(e.target.value.slice(0, MAX_LENGTH))
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                fontSize: 16,
                transition: "0.2s",
                "&.Mui-focused": {
                  boxShadow: "0 0 0 2px rgba(25,118,210,0.2)",
                },
              },
            }}
          />

          {/* Footer Content */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mt={1.5}
          >
            <Typography variant="caption" color="text.secondary">
              Be respectful · No spam
            </Typography>

            <Typography
              variant="caption"
              color={
                content.length >= MAX_LENGTH
                  ? "error.main"
                  : "text.secondary"
              }
            >
              {content.length}/{MAX_LENGTH}
            </Typography>
          </Stack>
        </DialogContent>

        <Divider />

        {/* Actions */}
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={onClose}
            disabled={loading}
            color="inherit"
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!content.trim() || loading}
            sx={{
              borderRadius: 999,
              px: 4,
              height: 42,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Post"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Message */}
      <Snackbar
        open={successOpen}
        autoHideDuration={4000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessOpen(false)}
          severity="success"
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          <strong>Post submitted!</strong> It will be reviewed and published shortly.
        </Alert>
      </Snackbar>
    </>
  )
}