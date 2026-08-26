// pages/NGODashboardPage.tsx

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getNGODashboard } from "../../../apis/ngo/applyNGO";

import NGOHeader from "../components/NGOHeader";
import NGOStats from "../components/NGOStats";
import NGOQuickActions from "../components/NGOQuickActions";
import ManageMembersDialog from "../components/ManageMembersDialog";
import CreateCommunityTaskDialog from "../components/CreateCommunityTaskDialog";

import { type NGODashboardResponse } from "../types/ngo";

const NGODashboardPage = () => {
  const [dashboard, setDashboard] =
    useState<NGODashboardResponse | null>(null);

  const [loading, setLoading] =
    useState(true);
  const [membersOpen, setMembersOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const loadDashboard = async () => {
    try {
      const data = await getNGODashboard();
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

  useEffect(() => {
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
        onCreateCommunityTask={() =>
          setTaskDialogOpen(true)
        }
      />

      <ManageMembersDialog
        open={membersOpen}
        onClose={() =>
          setMembersOpen(false)
        }
        ngoId={dashboard.ngo.id}
      />

      <CreateCommunityTaskDialog
        open={taskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
        onSuccess={() => {
          setTaskDialogOpen(false);
          // Refresh stats (totalCommunityTasks / activeCommunityTasks) after creation.
          loadDashboard();
        }}
        ngoId={dashboard.ngo.id}
        ngoAreaId={dashboard.ngo.area.id}
        ngoAreaName={dashboard.ngo.area.name}
        userRole={dashboard.membership.role}
      />
    </>
  );
};

export default NGODashboardPage;