import { Paper, Typography, Stack } from "@mui/material"
import LightbulbIcon from "@mui/icons-material/Lightbulb"

const facts = [
  "LED bulbs use up to 75% less energy than incandescent bulbs.",
  "Planting one tree can absorb about 22 kg of CO₂ per year.",
  "Reducing food waste lowers methane emissions from landfills.",
  "Public transport can cut carbon emissions by up to 45%.",
  "Using reusable bottles saves hundreds of plastic bottles yearly.",
  "Turning off idle devices prevents unnecessary energy loss.",
]

export function DidYouKnow() {
  const fact = facts[Math.floor(Math.random() * facts.length)]

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
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <LightbulbIcon
            sx={{
              color: "#fbc02d",
              filter: "drop-shadow(0 0 6px rgba(251, 192, 45, 0.7))",
            }}
          />
          <Typography fontWeight={700}>Did You Know?</Typography>
        </Stack>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            lineHeight: 1.6,
          }}
        >
          {fact}
        </Typography>
      </Stack>
    </Paper>
  )
}
