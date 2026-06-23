import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Divider,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";

import {
  useEffect,
  useState,
} from "react";

import {
  getNGODetails,
  getNGOMembers,
  suspendNGO,
  suspendMember,
  reactivateMember
} from "../../../apis/super-admin/admin.api";

interface Props {
  ngoId: string | null;
  open: boolean;
  onClose: () => void;
}

const NGODetailsDialog = ({
  ngoId,
  open,
  onClose,
}: Props) => {
  const [ngo, setNgo] =
    useState<any>(null);

  const [members, setMembers] =
    useState<any[]>([]);

  useEffect(() => {
    if (
      !ngoId ||
      !open
    ) {
      return;
    }

    fetchData();
  }, [ngoId, open]);

  const fetchData =
    async () => {
      try {
        const ngoData =
          await getNGODetails(
            ngoId!
          );

        const memberData =
          await getNGOMembers(
            ngoId!
          );

        setNgo(
          ngoData.data.data.data
        );

        setMembers(
          memberData.data
        );
      } catch (
      error
      ) {
        console.error(
          error
        );
      }
    };

  const handleSuspendNGO =
    async () => {
      await suspendNGO(
        ngoId!
      );

      fetchData();
    };

  const handleSuspendMember =
    async (
      memberId: string
    ) => {
      await suspendMember(
        memberId
      );

      fetchData();
    };

  const handleReactivateMember =
    async (memberId: string) => {
      await reactivateMember(memberId);

      fetchData();
    };

  if (!ngo) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        NGO Details
      </DialogTitle>

      <DialogContent>
        <Typography>
          <strong>
            Name:
          </strong>{" "}
          {ngo.name}
        </Typography>

        <Typography>
          <strong>
            Area:
          </strong>{" "}
          {
            ngo.area
              ?.name
          }
        </Typography>

        <Typography>
          <strong>
            Status:
          </strong>{" "}
          {ngo.status}
        </Typography>

        <Typography>
          <strong>
            Members:
          </strong>{" "}
          {
            ngo.memberCount
          }
        </Typography>

        <Typography>
          <strong>
            Created:
          </strong>{" "}
          {new Date(
            ngo.createdAt
          ).toLocaleDateString()}
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 2 }}
        >
          <Button
            color="error"
            variant="contained"
            onClick={
              handleSuspendNGO
            }
          >
            Suspend NGO
          </Button>
        </Stack>

        <Divider
          sx={{
            my: 3,
          }}
        />

        <Typography
          variant="h6"
          gutterBottom
        >
          Members
        </Typography>

        <List>
          {members.map(
            (
              member
            ) => (
              <ListItem
                key={
                  member.id
                }
                secondaryAction={
                  member.status === "ACTIVE" ? (
                    <Button
                      color="error"
                      size="small"
                      onClick={() =>
                        handleSuspendMember(member.id)
                      }
                    >
                      Suspend
                    </Button>
                  ) : (
                    <Button
                      color="success"
                      size="small"
                      onClick={() =>
                        handleReactivateMember(member.id)
                      }
                    >
                      Reactivate
                    </Button>
                  )
                }
              >
                <ListItemText
                  primary={
                    member.user?.profile?.fullName ??
                    member.user?.email
                  }
                  secondary={
                    <>
                      {member.role?.name}
                      <Chip
                        size="small"
                        label={member.status}
                        color={
                          member.status === "ACTIVE"
                            ? "success"
                            : "warning"
                        }
                        sx={{ ml: 1 }}
                      />
                    </>
                  }
                />
              </ListItem>
            )
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default NGODetailsDialog;