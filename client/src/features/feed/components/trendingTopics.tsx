import { Paper, Typography, Stack, Chip } from "@mui/material"
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment"

const topics = [
  "#PlasticFree2026",
  "#GreenCoding",
  "#Canopux",
  "#SolarEnergy",
  "#WaterConservation",
  "#ZeroWaste",
]

export function TrendingTopics() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "grey.200",
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <LocalFireDepartmentIcon sx={{ color: "#2e7d32" }} />
          <Typography fontWeight={700}>Trending Topics</Typography>
        </Stack>

        <Stack direction="row" flexWrap="wrap" gap={1}>
          {topics.map((topic) => (
            <Chip
              key={topic}
              label={topic}
              clickable
              sx={{
                fontWeight: 600,
                bgcolor: "rgba(46, 125, 50, 0.08)",
                color: "#2e7d32",
                "&:hover": {
                  bgcolor: "rgba(46, 125, 50, 0.15)",
                },
              }}
            />
          ))}
        </Stack>
      </Stack>
    </Paper>
  )
}
