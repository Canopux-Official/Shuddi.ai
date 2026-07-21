export const colors = {
  forest: "#0f3d2e",
  forestSage: "#2f6b4f",
  cream: "#f7f5ef",
  surface: "#ffffff",
  ink: "#1c2b22",
  inkMuted: "#5b6b60",
  accentGold: "#c9972c",
  border: "#e2e8e0",
  danger: "#d85a30",
} as const;

export const radius = {
  card: 12,
  control: 8,
} as const;

export const fonts = {
  display: "'Lora', serif",
  body: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const;

// Semantic meaning, not just decoration:
// danger    -> needs your action (pending approvals, flags)
// forestSage -> healthy / active state
// accentGold -> achievement / completed
// forest     -> neutral informational count
export const withOpacity = (hex: string, alpha: number) => {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};