import type { RegistrationStatus, TaskTimeline } from "../types/communityTasks";

export interface TimelineTab {
  value: TaskTimeline;
  label: string;
}

export const TIMELINE_TABS: TimelineTab[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "past", label: "Past" },
];

export type BadgeColor = "info" | "success" | "default";

export interface TimelineBadgeMeta {
  label: string;
  color: BadgeColor;
}

export type StatusColor = "info" | "warning" | "success" | "error" | "secondary";

export interface RegistrationStatusMeta {
  label: string;
  color: StatusColor;
}

// Mapped type instead of Record<TaskTimeline, ...> — functionally identical,
// but avoids the angle-bracket generic syntax that was getting misparsed.
export const TIMELINE_BADGE: { [K in TaskTimeline]: TimelineBadgeMeta } = {
  upcoming: { label: "Upcoming", color: "info" },
  ongoing: { label: "Live", color: "success" },
  past: { label: "Past", color: "default" },
};

export const REGISTRATION_STATUS_META: { [K in RegistrationStatus]: RegistrationStatusMeta } = {
  REGISTERED: { label: "Registered", color: "info" },
  SUBMITTED: { label: "Submitted", color: "secondary" },
  UNDER_VERIFICATION: { label: "Under verification", color: "warning" },
  COMPLETED: { label: "Completed", color: "success" },
  REJECTED: { label: "Rejected", color: "error" },
};

export function formatDateRange(startAt: Date, endAt: Date): string {
  const sameDay = startAt.toDateString() === endAt.toDateString();
  const dateFmt = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeFmt = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" });

  if (sameDay) {
    return `${dateFmt.format(startAt)} \u00B7 ${timeFmt.format(startAt)} \u2013 ${timeFmt.format(endAt)}`;
  }
  return `${dateFmt.format(startAt)} ${timeFmt.format(startAt)} \u2013 ${dateFmt.format(endAt)} ${timeFmt.format(endAt)}`;
}