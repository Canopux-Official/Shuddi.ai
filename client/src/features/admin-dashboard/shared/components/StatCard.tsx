import { Card, CardContent, Box, Typography } from "@mui/material";
import { colors, fonts, withOpacity } from "../../theme/tokens";

interface RingData {
  current: number;
  total: number;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  accentColor: string;
  ring?: RingData;
}

const Ring = ({ current, total, color }: RingData & { color: string }) => {
  const pct = total > 0 ? Math.min(current / total, 1) : 0;
  const circumference = 2 * Math.PI * 8;
  return (
    <svg width="22" height="22" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" fill="none" stroke={colors.border} strokeWidth="2" />
      <circle
        cx="10"
        cy="10"
        r="8"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={`${circumference * pct} ${circumference}`}
        transform="rotate(-90 10 10)"
      />
    </svg>
  );
};

const StatCard = ({ title, value, icon: Icon, accentColor, ring }: StatCardProps) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Typography sx={{ fontSize: 13, color: colors.inkMuted }}>{title}</Typography>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: withOpacity(accentColor, 0.12),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 16, color: accentColor }} />
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mt: 1.5 }}>
          <Typography sx={{ fontFamily: fonts.mono, fontSize: 26, fontWeight: 500, color: colors.ink }}>
            {value.toLocaleString()}
          </Typography>
          {ring && <Ring current={ring.current} total={ring.total} color={accentColor} />}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;