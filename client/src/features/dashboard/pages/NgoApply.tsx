import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
    Box,
    TextField,
    Typography,
    Button,
    Paper,
    MenuItem,
    Grid,
    Stack,
    Divider,
    CircularProgress
} from "@mui/material";
import ParkOutlinedIcon from "@mui/icons-material/ParkOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import { useState } from "react";
import { applyForNGO, getAreas } from "../../../apis/ngo/applyNGO";
import { applyNGOSchema, type ApplyNGOFormValues, type NGODocumentField } from "./applyNGO.schema";
import FileUploadField from "./FileUploadField";

const FOREST = "#2D5A3D";
const FOREST_DARK = "#1F3D2B";
const CREAM = "#FAF6EE";
const AMBER = "#C98A2C";
const INK = "#2B2B26";
const SUBTLE = "#6B6B5F";

const SectionHeading = ({
    icon,
    title,
    subtitle
}: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
}) => (
    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2.5 }}>
        <Box
            sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                bgcolor: "rgba(45,90,61,0.08)",
                color: FOREST,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
            }}
        >
            {icon}
        </Box>
        <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: INK, lineHeight: 1.3 }}>
                {title}
            </Typography>
            <Typography variant="body2" sx={{ color: SUBTLE }}>
                {subtitle}
            </Typography>
        </Box>
    </Stack>
);

const ApplyNGO = () => {
    const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<ApplyNGOFormValues>({
        resolver: zodResolver(applyNGOSchema),
        defaultValues: {
            name: "",
            description: "",
            areaId: "",
            email: "",
            phone: "",
            registration: undefined,
            pan: undefined,
            address: undefined
        }
    });

    const {
        data: areas = [],
        isLoading: areasLoading,
        isError: areasError
    } = useQuery({
        queryKey: ["ngo-areas"],
        queryFn: async () => {
            const data = await getAreas();
            // defensively handle either a bare array or a wrapped { data: [...] } envelope
            return Array.isArray(data) ? data : (data as { data?: typeof data })?.data ?? [];
        }
    });

    const mutation = useMutation({
        mutationFn: (values: ApplyNGOFormValues) =>
            applyForNGO({
                name: values.name,
                description: values.description,
                areaId: values.areaId,
                // NOTE: applyForNGO's ApplyNGOInput type doesn't have email/phone fields yet,
                // so they aren't sent to the backend. See the TODO further down.
                documents: {
                    registration: values.registration,
                    pan: values.pan,
                    address: values.address
                }
            }),
        onSuccess: (_result, values) => {
            toast.success("Application submitted");
            setSubmittedEmail(values.email);
        },
        onError: (err: unknown) => {
            const message = err instanceof Error ? err.message : "Couldn't submit your application. Please try again.";
            toast.error(message);
        }
    });

    const onSubmit = (values: ApplyNGOFormValues) => {
        mutation.mutate(values);
    };

    if (submittedEmail) {
        return (
            <Box sx={{ maxWidth: 640, mx: "auto", mt: { xs: 4, md: 8 }, px: 2 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 3,
                        border: "1px solid #E4DFD0",
                        bgcolor: CREAM,
                        textAlign: "center"
                    }}
                >
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            bgcolor: "rgba(45,90,61,0.1)",
                            color: FOREST,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            mb: 2.5
                        }}
                    >
                        <TaskAltIcon sx={{ fontSize: 34 }} />
                    </Box>

                    <Typography variant="h5" sx={{ fontWeight: 700, color: INK, mb: 1.5 }}>
                        Application received
                    </Typography>

                    <Typography variant="body1" sx={{ color: SUBTLE, maxWidth: 440, mx: "auto", mb: 3 }}>
                        Thanks for applying to partner with Shuddi. Our team will review your application and
                        get back to you within 7 working days.
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            bgcolor: "#fff",
                            border: "1px solid #E4DFD0",
                            borderRadius: 2,
                            py: 1.5,
                            px: 2,
                            mb: 3
                        }}
                    >
                        <MailOutlineIcon sx={{ color: AMBER, fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: INK }}>
                            We'll email you at <strong>{submittedEmail}</strong> once a decision is made
                        </Typography>
                    </Stack>
                    {/*
                      TODO: applyForNGO's ApplyNGOInput type currently has no email/phone fields,
                      so the address shown above is never persisted server-side. Either extend
                      ApplyNGOInput + the /ngo/apply payload to accept email/phone, or have the
                      backend notify the NGO's already-authenticated account email instead —
                      otherwise this promise won't actually be kept.
                    */}

                    <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="center" sx={{ color: SUBTLE }}>
                        <ScheduleOutlinedIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">No action needed from you in the meantime</Typography>
                    </Stack>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 760, mx: "auto", mt: { xs: 3, md: 6 }, mb: 6, px: 2 }}>
            <Stack spacing={0.5} sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <ParkOutlinedIcon sx={{ color: FOREST }} />
                    <Typography variant="overline" sx={{ color: FOREST, fontWeight: 700, letterSpacing: 1 }}>
                        Partner with Shuddi
                    </Typography>
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 700, color: INK, fontFamily: "Lora, serif" }}>
                    Register your NGO
                </Typography>
                <Typography variant="body1" sx={{ color: SUBTLE, maxWidth: 560 }}>
                    Tell us about your organization so we can verify it and connect it with citizens in your area.
                </Typography>
            </Stack>

            <Paper
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                elevation={0}
                sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3, border: "1px solid #E4DFD0", bgcolor: "#fff" }}
            >
                <SectionHeading
                    icon={<DescriptionOutlinedIcon fontSize="small" />}
                    title="Organization details"
                    subtitle="Basic information about the NGO"
                />

                <Grid container spacing={2.5} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12 }}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="NGO name"
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="What does your NGO do?"
                                    placeholder="Describe your mission, past initiatives, and the environmental issues you focus on"
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Controller
                            name="areaId"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    fullWidth
                                    label="Area of operation"
                                    disabled={areasLoading}
                                    error={!!errors.areaId || areasError}
                                    helperText={
                                        errors.areaId?.message ??
                                        (areasError ? "Couldn't load areas — please refresh the page" : undefined)
                                    }
                                >
                                    {areasLoading && (
                                        <MenuItem disabled value="">
                                            Loading areas…
                                        </MenuItem>
                                    )}
                                    {!areasLoading && areas.length === 0 && !areasError && (
                                        <MenuItem disabled value="">
                                            No areas available
                                        </MenuItem>
                                    )}
                                    {areas.map((area: { id: string; name: string }) => (
                                        <MenuItem key={area.id} value={area.id}>
                                            {area.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    type="email"
                                    label="Contact email"
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Contact phone"
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message}
                                />
                            )}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ mb: 4, borderColor: "#E4DFD0" }} />

                <SectionHeading
                    icon={<TaskAltIcon fontSize="small" />}
                    title="Supporting documents"
                    subtitle="Used to verify your organization before approval"
                />

                <Grid container spacing={2.5} sx={{ mb: 1 }}>
                    {(
                        [
                            { field: "registration" as NGODocumentField, label: "Registration certificate" },
                            { field: "pan" as NGODocumentField, label: "PAN card" },
                            { field: "address" as NGODocumentField, label: "Address proof" }
                        ] as const
                    ).map(({ field, label }) => (
                        <Grid size={{ xs: 12 }} key={field}>
                            <Controller
                                name={field}
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <FileUploadField
                                        label={label}
                                        file={value ?? null}
                                        error={errors[field]?.message as string | undefined}
                                        onSelect={onChange}
                                        onRemove={() => onChange(undefined)}
                                    />
                                )}
                            />
                        </Grid>
                    ))}
                </Grid>

                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || mutation.isPending}
                    sx={{
                        mt: 3,
                        py: 1.25,
                        px: 4,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "1rem",
                        bgcolor: FOREST,
                        "&:hover": { bgcolor: FOREST_DARK }
                    }}
                    startIcon={mutation.isPending ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : undefined}
                >
                    {mutation.isPending ? "Submitting…" : "Submit application"}
                </Button>

                <Typography variant="caption" sx={{ display: "block", mt: 1.5, color: SUBTLE }}>
                    By submitting, you confirm the details above are accurate. Our team will review your
                    application and follow up by email within 7 working days.
                </Typography>
            </Paper>
        </Box>
    );
};

export default ApplyNGO;