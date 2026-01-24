import { Paper, Typography, Stack, Avatar, Box, Chip } from "@mui/material"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"

import { useEffect, useState } from "react"



// Mock Data. Real Leaderboard data will be fetched from dashboard in future.
const MOCK_CONTRIBUTORS = [
  {
    user: {
      id: "1",
      username: "riya",
      displayName: "Riya Verma",
      avatarUrl: "https://i.pravatar.cc/150?img=47",
    },
    level: 12,
    xp: 1840,
  },
  {
    user: {
      id: "2",
      username: "ashish",
      displayName: "Ashish Mittal",
      avatarUrl: "https://i.pravatar.cc/150?img=12",
    },
    level: 9,
    xp: 1430,
  },
  {
    user: {
      id: "3",
      username: "rohit",
      displayName: "Rohit Sharma",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
    },
    level: 7,
    xp: 980,
  },
]



type Contributor = {
  user: {
    id: string
    username: string
    displayName?: string
    avatarUrl?: string
  }
  level: number
  xp: number
}



export function TopContributors() {
  const [contributors, setContributors] = useState<Contributor[]>([])

  useEffect(() => {
    
  // Real Leaderboard data will be fetched from dashboard in future. 
    setContributors(MOCK_CONTRIBUTORS)
  }, [])

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "grey.200",
      }}
    >
      <Stack spacing={2.5}>
        {/* HEADER */}
        <Stack direction="row" spacing={1} alignItems="center">
          <EmojiEventsIcon
            sx={{
              color: "#fbc02d",
              filter: "drop-shadow(0 0 6px rgba(251,192,45,0.7))",
            }}
          />
          <Typography fontWeight={700}>
            Top Contributors
          </Typography>
        </Stack>

        {/* LIST */}
        <Stack spacing={2}>
          {contributors.map((user) => (
            <Stack
              key={user.user.id}
              direction="row"
              spacing={2}
              alignItems="center"
            >
              {/* AVATAR */}
              <Avatar
                src={user.user.avatarUrl}
                sx={{ width: 38, height: 38 }}
              >
                {user.user.username[0].toUpperCase()}
              </Avatar>

              {/* NAME + META */}
              <Box sx={{ flex: 1 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography fontWeight={600} fontSize={14}>
                    {user.user.displayName || user.user.username}
                  </Typography>

                  <Chip
                    label={`LVL ${user.level}`}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: 11,
                      fontWeight: 700,
                      bgcolor: "rgba(251,192,45,0.15)",
                      color: "#9a7b00",
                    }}
                  />
                </Stack>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {user.xp} XP
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Paper>
  )
}