import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import TuneIcon from "@mui/icons-material/TuneOutlined";

export interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", path: "/admin-dashboard", icon: DashboardIcon },
  { label: "Control Center", path: "/admin/control-center", icon: TuneIcon },
];