import { useEffect, useState } from "react";
import { Box, Typography, Button, Stack, Divider, CircularProgress, Chip } from "@mui/material";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import toast from "react-hot-toast";

import {
  getNGODetails,
  getNGOMembers,
  suspendNGO,
  suspendMember,
  reactivateMember,
} from "../../../apis/super-admin/admin.api";
import ControlDialog from "../shared/components/ControlDialog";
import EmptyState from "../shared/components/EmptyState";
import { colors, withOpacity } from "../theme/tokens";

interface NGODetails {
  name: string;
  status: string;
  memberCount: number;
  createdAt: string;
  area?: { name: string };
}

interface Member {
  id: string;
  status: "ACTIVE" | "SUSPENDED";
  role?: { name: string };
  user?: { email: string; profile?: { fullName?: string } };
}

interface Props {
  ngoId: string | null;
  open: boolean;
  onClose: () => void;
}

const statusColor = (status: string) =>
  status === "ACTIVE" ? colors.forestSage : status === "SUSPENDED" ? colors.danger : colors.accentGold;

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.75 }}>
    <Typography sx={{ fontSize: 13, color: colors.inkMuted }}>{label}</Typography>
    <Typography sx={{ fontSize: 13, color: colors.ink, fontWeight: 500 }}>{value}</Typography>
  </Box>
);

const NGODetailsDialog = ({ ngoId, open, onClose }: Props) => {
  const [ngo, setNgo] = useState<NGODetails | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingMemberId, setActingMemberId] = useState<string | null>(null);
  const [suspendingNGO, setSuspendingNGO] = useState(false);

  useEffect(() => {
    if (!ngoId || !open) return;
    fetchData();
  }, [ngoId, open]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const ngoData = await getNGODetails(ngoId!);
      const memberData = await getNGOMembers(ngoId!);
      setNgo(ngoData.data.data.data);
      setMembers(memberData.data);
    } catch (error) {
      console.error(error);
      toast.error("Couldn't load NGO details");
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendNGO = async () => {
    if (!window.confirm(`Suspend ${ngo?.name}? This will pause all their activity on the platform.`)) return;
    try {
      setSuspendingNGO(true);
      await suspendNGO(ngoId!);
      toast.success("NGO suspended");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to suspend NGO");
    } finally {
      setSuspendingNGO(false);
    }
  };

  const handleSuspendMember = async (memberId: string) => {
    try {
      setActingMemberId(memberId);
      await suspendMember(memberId);
      toast.success("Member suspended");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to suspend member");
    } finally {
      setActingMemberId(null);
    }
  };

  const handleReactivateMember = async (memberId: string) => {
    try {
      setActingMemberId(memberId);
      await reactivateMember(memberId);
      toast.success("Member reactivated");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to reactivate member");
    } finally {
      setActingMemberId(null);
    }
  };

  return (
    <ControlDialog open={open} onClose={onClose} title="NGO details" icon={BusinessOutlinedIcon} maxWidth="sm">
      {loading ? (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress size={24} sx={{ color: colors.forest }} />
        </Box>
      ) : !ngo ? (
        <EmptyState icon={BusinessOutlinedIcon} title="NGO not found" description="This NGO may have been removed." />
      ) : (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
            <Typography sx={{ fontSize: 17, fontWeight: 600, color: colors.ink }}>{ngo.name}</Typography>
            <Chip
              label={ngo.status}
              size="small"
              sx={{ bgcolor: withOpacity(statusColor(ngo.status), 0.12), color: statusColor(ngo.status), fontWeight: 500, fontSize: 11 }}
            />
          </Box>

          <Box sx={{ border: `0.5px solid ${colors.border}`, borderRadius: 2, px: 1.5, mb: 2 }}>
            <InfoRow label="Area" value={ngo.area?.name ?? "—"} />
            <Divider sx={{ borderColor: colors.border }} />
            <InfoRow label="Members" value={ngo.memberCount} />
            <Divider sx={{ borderColor: colors.border }} />
            <InfoRow label="Created" value={new Date(ngo.createdAt).toLocaleDateString()} />
          </Box>

          <Button
            variant="outlined"
            size="small"
            onClick={handleSuspendNGO}
            disabled={suspendingNGO || ngo.status === "SUSPENDED"}
            sx={{ textTransform: "none", color: colors.danger, borderColor: colors.danger, "&:hover": { borderColor: colors.danger, bgcolor: withOpacity(colors.danger, 0.06) } }}
          >
            {suspendingNGO ? "Suspending..." : ngo.status === "SUSPENDED" ? "Already suspended" : "Suspend NGO"}
          </Button>

          <Divider sx={{ my: 2.5, borderColor: colors.border }} />

          <Typography sx={{ fontSize: 13, fontWeight: 500, color: colors.ink, mb: 1.5 }}>
            Members ({members.length})
          </Typography>

          {members.length === 0 ? (
            <EmptyState icon={GroupsOutlinedIcon} title="No members yet" />
          ) : (
            <Stack spacing={1}>
              {members.map((member) => {
                const isActing = actingMemberId === member.id;
                const isActive = member.status === "ACTIVE";
                return (
                  <Box
                    key={member.id}
                    sx={{ p: 1.5, border: `0.5px solid ${colors.border}`, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 500, color: colors.ink }} noWrap>
                        {member.user?.profile?.fullName ?? member.user?.email}
                      </Typography>
                      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.25 }}>
                        <Typography sx={{ fontSize: 12, color: colors.inkMuted }}>{member.role?.name}</Typography>
                        <Chip
                          label={member.status}
                          size="small"
                          sx={{ height: 18, fontSize: 10, fontWeight: 500, bgcolor: withOpacity(statusColor(member.status), 0.12), color: statusColor(member.status) }}
                        />
                      </Stack>
                    </Box>

                    <Button
                      size="small"
                      disabled={isActing}
                      onClick={() => (isActive ? handleSuspendMember(member.id) : handleReactivateMember(member.id))}
                      sx={{ textTransform: "none", flexShrink: 0, color: isActive ? colors.danger : colors.forestSage }}
                    >
                      {isActing ? "..." : isActive ? "Suspend" : "Reactivate"}
                    </Button>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Box>
      )}
    </ControlDialog>
  );
};

export default NGODetailsDialog;