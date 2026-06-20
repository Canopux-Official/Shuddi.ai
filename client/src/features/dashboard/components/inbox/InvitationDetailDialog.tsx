// src/components/inbox/InvitationDetailDialog.tsx

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Chip,
} from "@mui/material";

import toast from "react-hot-toast";

import {
    acceptInvitation,
    rejectInvitation,
} from "../../../../apis/dashboard/inbox.api";

import type {
    Invitation,
} from "./types";

interface Props {
    open: boolean;
    invitation: Invitation | null;
    onClose: () => void;
    onActionComplete: () => void;
}

const InvitationDetailDialog = ({
    open,
    invitation,
    onClose,
    onActionComplete,
}: Props) => {

    if (!invitation) {
        return null;
    }

    const handleAccept =
        async () => {

            try {

                await acceptInvitation(
                    invitation.id
                );

                toast.success(
                    "Invitation accepted"
                );

                onActionComplete();

            } catch (error: any) {

                toast.error(
                    error.message ||
                    "Failed to accept invitation"
                );
            }
        };

    const handleReject =
        async () => {

            try {

                await rejectInvitation(
                    invitation.id
                );

                toast.success(
                    "Invitation rejected"
                );

                onActionComplete();

            } catch (error: any) {

                toast.error(
                    error.message ||
                    "Failed to reject invitation"
                );
            }
        };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                NGO Invitation
            </DialogTitle>

            <DialogContent>

                <Box mb={2}>
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                    >
                        NGO
                    </Typography>

                    <Typography variant="h6">
                        {
                            invitation.ngo
                                .name
                        }
                    </Typography>
                </Box>

                <Box mb={2}>
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                    >
                        Area
                    </Typography>

                    <Typography>
                        {
                            invitation.ngo
                                .area
                                .name
                        }
                    </Typography>
                </Box>

                <Box mb={2}>
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                    >
                        Role
                    </Typography>

                    <Typography>
                        {
                            invitation.role
                                .name
                        }
                    </Typography>
                </Box>

                {invitation.role
                    .description && (

                    <Box mb={2}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Description
                        </Typography>

                        <Typography>
                            {
                                invitation
                                    .role
                                    .description
                            }
                        </Typography>
                    </Box>
                )}

                <Box mb={2}>
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                    >
                        NGO Status
                    </Typography>

                    <Chip
                        label={
                            invitation.ngo
                                .status
                        }
                        color="success"
                    />
                </Box>

            </DialogContent>

            <DialogActions>

                <Button
                    color="error"
                    onClick={
                        handleReject
                    }
                >
                    Reject
                </Button>

                <Button
                    variant="contained"
                    onClick={
                        handleAccept
                    }
                >
                    Accept
                </Button>

            </DialogActions>
        </Dialog>
    );
};

export default InvitationDetailDialog;