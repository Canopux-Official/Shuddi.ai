import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Stack,
  Box,
  Divider,
} from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import type { MockGlobalFeedItem as GlobalFeedItem } from "./mockGlobalFeedItem"

type Props = {
  post: GlobalFeedItem
}

export function PostCard({ post }: Props) {
  const isHighLevel = post.author.level >= 10

  return (
    <Card
      elevation={0}
      sx={{
        maxWidth: 720,
        mx: "auto",
        borderRadius: 4,
        border: "1px solid",
        borderColor: "grey.200",
        background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background:
            "linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        },
        "&:hover": {
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
          transform: "translateY(-4px)",
          borderColor: "grey.300",
        },
      }}
    >
      {/* VERIFIED BADGE */}
        <Box
          sx={{
            position: "absolute",
            top: 14,
            right: 14,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            px: 1.3,
            py: 0.45,
            borderRadius: 999,
            background: "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)",
            color: "white",
            fontSize: 11,
            fontWeight: 700,
            boxShadow: "0 4px 14px rgba(46, 125, 50, 0.45)",
            zIndex: 2,
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 14 }} />
          VERIFIED
        </Box>

      <CardHeader
        sx={{
          px: 3.5,
          pt: 3.5,
          pb: 2,
        }}
        avatar={
          <Box
            sx={{
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                borderRadius: "50%",
                background: isHighLevel
                  ? "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                zIndex: -1,
                opacity: 0.18,
              },
            }}
          >
            <Avatar
              src={post.author.avatarUrl}
              sx={{
                width: 52,
                height: 52,
                fontWeight: 700,
                fontSize: 20,
                background: isHighLevel
                  ? "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: isHighLevel
                  ? "0 4px 14px rgba(46, 125, 50, 0.4)"
                  : "0 4px 14px rgba(102, 126, 234, 0.4)",
              }}
            >
              {post.author.username[0].toUpperCase()}
            </Avatar>
          </Box>
        }
        title={
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography
              fontWeight={700}
              fontSize={17}
              sx={{
                background:
                  "linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {post.author.displayName || post.author.username}
            </Typography>

            {/* LEVEL BADGE */}
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                background: isHighLevel
                  ? "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: isHighLevel
                  ? "0 2px 8px rgba(46, 125, 50, 0.35)"
                  : "0 2px 8px rgba(102, 126, 234, 0.3)",
              }}
            >
              <Typography
                variant="caption"
                fontWeight={700}
                sx={{
                  color: "white",
                  fontSize: 11,
                  letterSpacing: 0.5,
                }}
              >
                LVL {post.author.level}
              </Typography>
            </Box>
          </Stack>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              mt: 0.5,
              fontSize: 13,
            }}
          >
            {new Date(post.createdAt).toLocaleString()}
          </Typography>
        }
      />

      <Divider sx={{ mx: 3.5, borderColor: "grey.200" }} />

      <CardContent sx={{ px: 3.5, py: 3 }}>
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.8,
            fontSize: 15.5,
            whiteSpace: "pre-wrap",
            color: "text.primary",
            fontWeight: 400,
            letterSpacing: 0.2,
          }}
        >
          {post.content}
        </Typography>
      </CardContent>

      {/* XP REWARD */}
        <Box
          sx={{
            position: "absolute",
            bottom: 14,
            right: 14,
            px: 1.4,
            py: 0.5,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            background: "rgba(46, 125, 50, 0.08)",
            border: "1px solid rgba(46, 125, 50, 0.3)",
            color: "#2e7d32",
            fontSize: 12,
            fontWeight: 700,
            backdropFilter: "blur(6px)",
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 14 }} />
          +{165} XP
        </Box>
    </Card>
  )
}
