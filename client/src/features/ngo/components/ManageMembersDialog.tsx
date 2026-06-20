// components/ManageMembersDialog.tsx

import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Stack,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
} from "@mui/material";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import {
    getMembers,
    suspendMember,
    removeMember,
    reactiveMember
} from "../../../apis/ngo/applyNGO";

import InviteMemberDialog
    from "./InviteMemberDialog";

import type {
    NGOMember,
} from "../types/ngo";

interface Props {
    open: boolean;
    onClose: () => void;
    ngoId: string;
}

const ManageMembersDialog = ({
    open,
    onClose,
    ngoId,
}: Props) => {

    const [members, setMembers] =
        useState<NGOMember[]>([]);

    const [
        inviteOpen,
        setInviteOpen,
    ] = useState(false);

    const loadMembers =
        async () => {

            try {
                const data =
                    await getMembers();

                setMembers(data);
            } catch {
                toast.error(
                    "Failed to load members"
                );
            }
        };

    useEffect(() => {
        if (open) {
            loadMembers();
        }
    }, [open]);

    const handleSuspend =
        async (
            memberId: string
        ) => {

            try {
                await suspendMember(
                    memberId
                );

                toast.success(
                    "Member suspended"
                );

                loadMembers();
            } catch (error: any) {
                toast.error(
                    error.message ||
                    "Failed to suspend member"
                );
            }
        };

    const handleRemove =
        async (
            memberId: string
        ) => {

            try {
                await removeMember(
                    memberId
                );

                toast.success(
                    "Member removed"
                );

                loadMembers();
            } catch (error: any) {
                toast.error(
                    error.message ||
                    "Failed to remove member"
                );
            }
        };

    const handleReactivate =
        async (
            memberId: string
        ) => {

            try {

                await reactiveMember(
                    memberId
                );

                toast.success(
                    "Member reactivated"
                );

                loadMembers();

            } catch (error: any) {

                toast.error(
                    error.message ||
                    "Failed to reactivate member"
                );
            }
        };

    const getStatusChipColor = (
        status: string
    ) => {

        switch (status) {

            case "ACTIVE":
                return "success";

            case "SUSPENDED":
                return "warning";

            case "REMOVED":
                return "error";

            default:
                return "default";
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="lg"
            >
                <DialogTitle>
                    Manage Members
                </DialogTitle>

                <DialogContent>

                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        mb={2}
                    >
                        <Button
                            variant="contained"
                            onClick={() =>
                                setInviteOpen(
                                    true
                                )
                            }
                        >
                            Invite Member
                        </Button>
                    </Stack>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Name
                                </TableCell>

                                <TableCell>
                                    Email
                                </TableCell>

                                <TableCell>
                                    Role
                                </TableCell>

                                <TableCell>
                                    Status
                                </TableCell>

                                <TableCell>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {members.map(
                                (member) => (
                                    <TableRow
                                        key={
                                            member.id
                                        }
                                    >
                                        <TableCell>
                                            {member.user
                                                .profile
                                                ?.displayName ??
                                                "-"}
                                        </TableCell>

                                        <TableCell>
                                            {
                                                member.user
                                                    .email
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {
                                                member.role
                                                    .name
                                            }
                                        </TableCell>

                                        <TableCell>

                                            <Chip
                                                label={member.status}
                                                color={
                                                    getStatusChipColor(
                                                        member.status
                                                    ) as any
                                                }
                                                size="small"
                                                variant="filled"
                                            />

                                        </TableCell>

                                        <TableCell>
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                            >
                                                {
                                                    member.status ===
                                                        "SUSPENDED" ? (

                                                        <Button
                                                            color="success"
                                                            onClick={() =>
                                                                handleReactivate(
                                                                    member.id
                                                                )
                                                            }
                                                        >
                                                            Reactivate
                                                        </Button>

                                                    ) : (

                                                        <Button
                                                            color="warning"
                                                            onClick={() =>
                                                                handleSuspend(
                                                                    member.id
                                                                )
                                                            }
                                                        >
                                                            Suspend
                                                        </Button>

                                                    )
                                                }

                                                <Button
                                                    color="error"
                                                    onClick={() =>
                                                        handleRemove(
                                                            member.id
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>

            <InviteMemberDialog
                open={inviteOpen}
                ngoId={ngoId}
                onClose={() =>
                    setInviteOpen(
                        false
                    )
                }
                onSuccess={() => {
                    setInviteOpen(
                        false
                    );
                    loadMembers();
                }}
            />
        </>
    );
};

export default ManageMembersDialog;