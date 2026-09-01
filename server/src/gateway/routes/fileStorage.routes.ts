import { Router } from "express";
import multer from "multer";
import * as FileStorageController from "../controllers/fileStorage.controller";
import { authMiddleware } from "../middleware/auth.middleware";

// Memory storage: we never write the file to disk, just hold the buffer
// long enough to forward it to the file-storage API.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB safety net
});

const router = Router();

router.post("/upload", authMiddleware, upload.single("file"), FileStorageController.uploadFile);

export default router;