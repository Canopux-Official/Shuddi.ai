import { useState } from "react"
import {
  Container,
  Typography,
  Button,
  Stack,
  Box,
  Divider,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"

import { mockGlobalFeed } from "../mock/feed.mock"
import { PostCard } from "../components/postCard"
import { DialogBox } from "../components/dialogBox"


// LEFT COLUMN COMPONENTS
import { TopContributors } from "../components/topContributors"
import { TrendingTopics } from "../components/trendingTopics"
import { DidYouKnow } from "../components/didYouKnow"

export function SocialFeed() {
  const [open, setOpen] = useState(false)

  return (

      <Box sx={{ minHeight: "100vh", py: 2.5 }}>
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            px: { xs: 2, sm: 4, md: 6, lg: 10 },
          }}
        >
          {/* PURE TEXT STICKY HEADER (NO BOX AT ALL) */}
          <Box
            sx={{
              position: "sticky",
              top: 64, // height of Header
              zIndex: 10,
              mb: 3,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h4" fontWeight={800}>
                Social Feed
              </Typography>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpen(true)}
                sx={{
                  fontWeight: 700,
                  px: 3,
                  py: 1.4,
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Create Post
              </Button>
            </Stack>
          </Box>

          {/* MAIN CONTENT GRID */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 2fr",
              },
              gap: 4,
            }}
          >
            {/* LEFT COLUMN */}
            <Stack
              spacing={3}
              sx={{
                position: { md: "sticky" },
                top: 120,
                height: "fit-content",
              }}
            >
              <TopContributors />
              <DidYouKnow />
              <TrendingTopics />
            </Stack>

            {/* RIGHT COLUMN */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Divider sx={{ flex: 1 }} />
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  Recent Posts
                </Typography>
                <Divider sx={{ flex: 1 }} />
              </Stack>

              <Stack spacing={3}>
                {mockGlobalFeed.items.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </Stack>

              <Box sx={{ mt: 5, textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary">
                  You've reached the end
                </Typography>
              </Box>
            </Box>
          </Box>

          <DialogBox open={open} onClose={() => setOpen(false)} />
        </Container>
      </Box>
  )
}
