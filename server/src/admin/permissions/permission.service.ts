import { ROLE_PERMISSIONS } from "./role.permissions";

export const getPermissionsByRole = (role: string) => {
  return ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || [];
};