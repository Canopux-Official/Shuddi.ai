import { z } from "zod";

export const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/png", "image/jpeg"];

export const ACCEPTED_FILE_TYPES_LABEL = "PDF, PNG or JPG";

const documentSchema = z
    .custom<File>((val) => val instanceof File, {
        message: "This document is required"
    })
    .refine((file) => file.size <= MAX_FILE_SIZE_BYTES, {
        message: `File must be smaller than ${MAX_FILE_SIZE_MB}MB`
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
        message: `Only ${ACCEPTED_FILE_TYPES_LABEL} files are accepted`
    });

export const applyNGOSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Organization name must be at least 3 characters")
        .max(120, "Organization name is too long"),
    description: z
        .string()
        .trim()
        .min(30, "Tell us a bit more about the NGO — at least 30 characters")
        .max(1000, "Keep the description under 1000 characters"),
    areaId: z.string().min(1, "Select the area you operate in"),
    email: z.string().trim().min(1, "Contact email is required").email("Enter a valid email address"),
    phone: z
        .string()
        .trim()
        .min(1, "Contact phone is required")
        .regex(/^[0-9+\-\s()]{7,15}$/, "Enter a valid phone number"),
    registration: documentSchema,
    pan: documentSchema,
    address: documentSchema
});

export type ApplyNGOFormValues = z.infer<typeof applyNGOSchema>;

export type NGODocumentField = "registration" | "pan" | "address";