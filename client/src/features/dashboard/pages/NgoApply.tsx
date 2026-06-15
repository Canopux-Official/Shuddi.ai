import { useEffect, useState } from "react";
import { applyForNGO, getAreas } from "../../../apis/ngo/applyNGO";
import {
    Box,
    TextField,
    Typography,
    Button,
    Paper,
    MenuItem,
    Grid
} from "@mui/material";

/**Display appropriate message if a field is missing or not filled in form the frontend. */

const ApplyNGO = () => {
    const [form, setForm] = useState({
        name: "",
        description: "",
        areaId: "",
        email: "",
        phone: ""
    });

    const [documents, setDocuments] = useState<{
        registration?: File;
        pan?: File;
        address?: File;
    }>({});


    const [areas, setAreas] = useState<{ id: string; name: string }[]>([]);

    const [previews, setPreviews] = useState({
        registration: "",
        pan: "",
        address: ""
    });
    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const data = await getAreas();
                setAreas(data);
            } catch (err) {
                console.error("Failed to fetch areas", err);
            }
        };

        fetchAreas();
    }, []);


    const handleFileChange = (e: any, type: string) => {
        const file = e.target.files[0];
        if (!file) return;

        setDocuments((prev) => ({
            ...prev,
            [type]: file
        }));

        const previewURL = URL.createObjectURL(file);

        setPreviews((prev) => ({
            ...prev,
            [type]: previewURL
        }));
    };

    const handleSubmit = async () => {
        try {
            const result = await applyForNGO({
                name: form.name,
                description: form.description,
                areaId: form.areaId,
                documents
            });

            console.log(result);
            alert("Application submitted!");

        } catch (err: any) {
            alert(err.message);
        }
    };

    const DocumentUpload = ({ label, type, preview, onChange }: any) => {
        return (
            <Box>
                <Button variant="outlined" component="label">
                    {label}
                    <input hidden type="file" onChange={(e) => onChange(e, type)} />
                </Button>

                {preview && (
                    <Box sx={{ mt: 2 }}>
                        {preview.includes("pdf") ? (
                            <Typography variant="body2">
                                PDF Uploaded
                            </Typography>
                        ) : (
                            <img
                                src={preview}
                                alt="preview"
                                style={{
                                    width: "150px",
                                    borderRadius: "8px",
                                    border: "1px solid #ccc"
                                }}
                            />
                        )}
                    </Box>
                )}
            </Box>
        );
    };
    return (
        <Box
            sx={{
                maxWidth: 800,
                mx: "auto",
                mt: 6
            }}
        >
            <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
                    Apply to Register NGO
                </Typography>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="NGO Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={3}
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            select
                            fullWidth
                            label="Area"
                            name="areaId"
                            value={form.areaId}
                            onChange={handleChange}
                        >
                            {areas.map((area) => (
                                <MenuItem key={area.id} value={area.id}>
                                    {area.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                        <TextField
                            fullWidth
                            label="Contact Email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                        <TextField
                            fullWidth
                            label="Contact Phone"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>

                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                    Upload Documents
                </Typography>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <DocumentUpload
                            label="Upload Registration Certificate"
                            type="registration"
                            preview={previews.registration}
                            onChange={handleFileChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <DocumentUpload
                            label="Upload PAN Card"
                            type="pan"
                            preview={previews.pan}
                            onChange={handleFileChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <DocumentUpload
                            label="Upload Address Proof"
                            type="address"
                            preview={previews.address}
                            onChange={handleFileChange}
                        />
                    </Grid>
                </Grid>

                <Button
                    variant="contained"
                    sx={{ mt: 4 }}
                    onClick={handleSubmit}
                >
                    Submit Application
                </Button>
            </Paper>
        </Box>
    );
};

export default ApplyNGO;