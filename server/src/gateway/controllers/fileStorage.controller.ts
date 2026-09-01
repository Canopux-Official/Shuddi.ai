import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadForContext, UploadContext } from "../services/fileStorage.service";
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";

const VALID_CONTEXTS: UploadContext[] = ["TASK_EVIDENCE", "NGO_APPLICATION_DOCS"];

/**
 * POST /api/file-storage/upload  (multipart/form-data, field name "file")
 * Body also takes a "context" field (defaults to TASK_EVIDENCE) that picks
 * which folder the file lands in — see FOLDER_ID_BY_CONTEXT in
 * fileStorage.service.ts.
 *
 * The file never touches the browser->file-storage connection directly:
 * multer buffers it into memory here, and this server forwards it on,
 * exactly as your friend asked.
 */
export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  const context = (req.body?.context || "TASK_EVIDENCE") as UploadContext;
  if (!VALID_CONTEXTS.includes(context)) {
    throw new ApiError(400, `Unknown upload context "${context}"`);
  }

  const result = await uploadForContext(context, {
    buffer: req.file.buffer,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
  });

  res.json(result);
});