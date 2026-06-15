// pages/NGODashboardPage.tsx

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getNGODashboard } from "../../../apis/ngo/applyNGO";

import NGOHeader from "../components/NGOHeader";
import NGOStats from "../components/NGOStats";
import NGOQuickActions from "../components/NGOQuickActions";
import ManageMembersDialog from "../components/ManageMembersDialog";

import { type NGODashboardResponse } from "../types/ngo";

const NGODashboardPage = () => {
  const [dashboard, setDashboard] =
    useState<NGODashboardResponse | null>(null);

  const [loading, setLoading] =
    useState(true);
  const [membersOpen, setMembersOpen,] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data =
          await getNGODashboard();

        setDashboard(data);
      } catch (error: any) {
        toast.error(
          error.message ||
          "Failed to load NGO dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!dashboard) {
    return <div>No data found</div>;
  }

  return (
    <>
      <NGOHeader dashboard={dashboard} />

      <NGOStats
        stats={dashboard.stats}
      />

      <NGOQuickActions
        permissions={
          dashboard.membership
            .permissions
        }

        onManageMembers={() =>
          setMembersOpen(true)
        }
      />
      <ManageMembersDialog
        open={membersOpen}
        onClose={() =>
          setMembersOpen(false)
        }
      />
    </>
  );
};

export default NGODashboardPage;