import { useRef, useState, type DragEvent } from "react";
import { Box, Typography, IconButton, Stack } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { ACCEPTED_FILE_TYPES_LABEL, MAX_FILE_SIZE_MB } from "./applyNGO.schema";

interface FileUploadFieldProps {
    label: string;
    file: File | null;
    error?: string;
    onSelect: (file: File) => void;
    onRemove: () => void;
}

const ACCEPT = "application/pdf,image/png,image/jpeg";

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileUploadField = ({ label, file, error, onSelect, onRemove }: FileUploadFieldProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragActive, setIsDragActive] = useState(false);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragActive(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) onSelect(droppedFile);
    };

    const isImage = file?.type.startsWith("image/");
    const previewUrl = isImage && file ? URL.createObjectURL(file) : null;

    return (
        <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#2B2B26", mb: 0.5 }}>
                {label}
            </Typography>

            {!file ? (
                <Box
                    onClick={() => inputRef.current?.click()}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Upload ${label}`}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragActive(true);
                    }}
                    onDragLeave={() => setIsDragActive(false)}
                    onDrop={handleDrop}
                    sx={{
                        border: "1.5px dashed",
                        borderColor: error ? "#C0362C" : isDragActive ? "#2D5A3D" : "#D8D2C2",
                        borderRadius: 2,
                        p: 2.5,
                        textAlign: "center",
                        cursor: "pointer",
                        bgcolor: isDragActive ? "rgba(45,90,61,0.06)" : "#FBF9F4",
                        transition: "border-color 0.15s ease, background-color 0.15s ease",
                        "&:hover": { borderColor: "#2D5A3D", bgcolor: "rgba(45,90,61,0.03)" },
                        "&:focus-visible": { outline: "2px solid #2D5A3D", outlineOffset: 2 }
                    }}
                >
                    <CloudUploadOutlinedIcon sx={{ fontSize: 26, color: "#8A8471", mb: 0.5 }} />
                    <Typography variant="body2" sx={{ color: "#4A4A40" }}>
                        <Box component="span" sx={{ color: "#2D5A3D", fontWeight: 600 }}>
                            Click to upload
                        </Box>{" "}
                        or drag and drop
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#8A8471" }}>
                        {ACCEPTED_FILE_TYPES_LABEL}, up to {MAX_FILE_SIZE_MB}MB
                    </Typography>
                    <input
                        ref={inputRef}
                        type="file"
                        hidden
                        accept={ACCEPT}
                        onChange={(e) => {
                            const selected = e.target.files?.[0];
                            if (selected) onSelect(selected);
                            e.target.value = "";
                        }}
                    />
                </Box>
            ) : (
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{ border: "1px solid #D8D2C2", borderRadius: 2, p: 1.5, bgcolor: "#FBF9F4" }}
                >
                    {previewUrl ? (
                        <Box
                            component="img"
                            src={previewUrl}
                            alt={file.name}
                            sx={{ width: 40, height: 40, borderRadius: 1, objectFit: "cover", flexShrink: 0 }}
                        />
                    ) : (
                        <InsertDriveFileOutlinedIcon sx={{ color: "#2D5A3D", flexShrink: 0 }} />
                    )}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                            {file.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#8A8471" }}>
                            {formatFileSize(file.size)}
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={onRemove} aria-label={`Remove ${label}`}>
                        <CloseRoundedIcon fontSize="small" />
                    </IconButton>
                </Stack>
            )}

            {error && (
                <Typography variant="caption" sx={{ color: "#C0362C", display: "block", mt: 0.5 }}>
                    {error}
                </Typography>
            )}
        </Box>
    );
};

export default FileUploadField;