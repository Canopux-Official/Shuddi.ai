// components/InviteMemberDialog.tsx

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
} from "@mui/material";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import {
    getRoles,
    inviteMember,
} from "../../../apis/ngo/applyNGO";

import type {
    NGORole,
} from "../types/ngo";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const InviteMemberDialog = ({
    open,
    onClose,
    onSuccess,
}: Props) => {

    const [email, setEmail] =
        useState("");

    const [roleId, setRoleId] =
        useState("");

    const [roles, setRoles] =
        useState<NGORole[]>([]);

    const loadRoles = async () => {
        try {
            const data =
                await getRoles();

            setRoles(data);
        } catch {
            toast.error(
                "Failed to load roles"
            );
        }
    };

    useEffect(() => {
        if (open) {
            loadRoles();
        }
    }, [open]);

    const handleInvite =
        async () => {

            try {
                await inviteMember({
                    email,
                    roleId,
                });

                toast.success(
                    "Invitation sent"
                );

                setEmail("");
                setRoleId("");

                onSuccess();
            } catch (error: any) {
                toast.error(
                    error.message ||
                    "Failed to invite"
                );
            }
        };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
        >
            <DialogTitle>
                Invite Member
            </DialogTitle>

            <DialogContent>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(
                            e.target.value
                        )
                    }
                />

                <TextField
                    select
                    fullWidth
                    margin="normal"
                    label="Role"
                    value={roleId}
                    onChange={(e) =>
                        setRoleId(
                            e.target.value
                        )
                    }
                >
                    {roles.map((role) => (
                        <MenuItem
                            key={role.id}
                            value={role.id}
                        >
                            {role.name}
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={
                        handleInvite
                    }
                >
                    Invite
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InviteMemberDialog;