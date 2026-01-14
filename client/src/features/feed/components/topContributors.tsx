import {
  Paper,
  Typography,
  Stack,
  Avatar,
  Box,
  Chip,
} from "@mui/material"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"

const contributors = [
  {
    name: "Ananya Verma",
    level: 12,
    xp: 1840,
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    name: "Rahul Sharma",
    level: 9,
    xp: 1430,
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Bruce Wayne",
    level: 7,
    xp: 980,
    avatar: "https://i.pravatar.cc/150?img=3",
  },
]

export function TopContributors() {
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
          <Typography fontWeight={700}>Top Contributors in 2026</Typography>
        </Stack>

        {/* LIST */}
        <Stack spacing={2}>
          {contributors.map((user, index) => (
            <Stack
              key={user.name}
              direction="row"
              spacing={2}
              alignItems="center"
            >
              {/* AVATAR */}
              <Avatar
                src={user.avatar}
                sx={{
                  width: 38,
                  height: 38,
                }}
              />

              {/* NAME + META */}
              <Box sx={{ flex: 1 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography fontWeight={600} fontSize={14}>
                    {user.name}
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
