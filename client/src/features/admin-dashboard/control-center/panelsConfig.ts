import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

import NGOControls from "../permissions/NGOControls";
import TaskControls from "../permissions/TaskControls";
import RewardControls from "../permissions/RewardControls";
import NGOGovernance from "../permissions/NGOGovernance";
import AreaControls from "../permissions/AreaControls";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import VerificationControls from "../permissions/VerificationControls";

export interface ControlPanelConfig {
  key: string;
  title: string;
  description: string;
  icon: React.ElementType;
  requiredPermissions: string[];
  component: React.ComponentType;
  dialogMaxWidth?: "sm" | "md" | "lg";
}

// Community controls intentionally left out until that API is ready —
// add it back here once it is, nothing else changes.
export const controlPanels: ControlPanelConfig[] = [
  {
    key: "ngo-moderation",
    title: "NGO moderation",
    description: "Approve, suspend, and review NGO applications.",
    icon: BusinessOutlinedIcon,
    requiredPermissions: ["NGO_APPROVE", "NGO_REMOVE"],
    component: NGOControls,
    dialogMaxWidth: "md",
  },
  {
    key: "task-governance",
    title: "Task governance",
    description: "Create tasks and manage their lifecycle.",
    icon: TaskAltOutlinedIcon,
    requiredPermissions: ["TASK_CREATE", "TASK_VERIFY", "TASK_DELETE"],
    component: TaskControls,
    dialogMaxWidth: "md",
  },
  {
    key: "reward-governance",
    title: "Reward governance",
    description: "Create and manage eco-rewards for citizens.",
    icon: CardGiftcardOutlinedIcon,
    requiredPermissions: ["REWARD_CREATE", "REWARD_EDIT", "REWARD_DELETE"],
    component: RewardControls,
    dialogMaxWidth: "sm",
  },
  {
    key: "ngo-governance",
    title: "NGO governance",
    description: "Manage NGO membership and view NGO details.",
    icon: GroupsOutlinedIcon,
    requiredPermissions: ["MEMBER_INVITE", "MEMBER_REMOVE"],
    component: NGOGovernance,
    dialogMaxWidth: "sm",
  },
  {
    key: "area-management",
    title: "Area management",
    description: "Review area requests and create new areas.",
    icon: MapOutlinedIcon,
    requiredPermissions: ["AREA_CREATE"],
    component: AreaControls,
    dialogMaxWidth: "sm",
  },
    {
    key: "verification-review",
    title: "Verification review",
    description: "Give a final human call on AI-uncertain submissions.",
    icon: PendingActionsOutlinedIcon,
    requiredPermissions: ["TASK_VERIFY"],
    component: VerificationControls,
    dialogMaxWidth: "lg",
  },
];