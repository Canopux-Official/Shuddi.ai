import { useEffect, useState } from "react";
import { getAdminPermissions } from "../../../apis/super-admin/admin.api"; // your api call

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await getAdminPermissions();
        setPermissions(response.data);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const hasAnyPermission = (required: string[]) => required.some((perm) => permissions.includes(perm));

  return { permissions, loading, hasAnyPermission };
};