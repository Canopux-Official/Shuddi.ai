/**
 * Client for the "multi-tenant-file-and-amp" storage service a friend
 * built (https://multi-tenant-file-and-amp.vercel.app).
 *
 * Per your friend: uploads must happen server-to-server, never from the
 * browser directly. So the flow is now:
 *   1. our server asks their API for a short-lived upload token
 *   2. our server immediately uploads the file bytes using that token
 *   3. their API returns a `file_url` that does NOT expire — we store
 *      that directly (e.g. in TaskSubmission.evidenceUrls, or an NGO
 *      application's document url). No re-resolving needed later.
 *
 * FOLDER ROUTING:
 * Different features upload into different (currently: the same) folder.
 * Add a case to UploadContext + FOLDER_ID_BY_CONTEXT for each new feature.
 * Right now NGO_APPLICATION_DOCS falls back to the task-evidence folder
 * because that's the only folder that exists — when you create a
 * dedicated folder later, just set NGO_APPLICATION_DOCS_FOLDER_ID in .env
 * and it'll automatically take over (no code change needed).
 */

const FILE_STORAGE_API_URL =
  process.env.FILE_STORAGE_API_URL || "https://multi-tenant-file-and-amp.onrender.com/v1";
const FILE_STORAGE_API_KEY = process.env.FILE_STORAGE_API_KEY;
const FILE_STORAGE_API_SECRET = process.env.FILE_STORAGE_API_SECRET;

export type UploadContext = "TASK_EVIDENCE" | "NGO_APPLICATION_DOCS";

const FOLDER_ID_BY_CONTEXT: Record<UploadContext, string | undefined> = {
  TASK_EVIDENCE: process.env.INDIVIDUAL_TASK_EVIDENCE_FOLDER_ID,
  // Falls back to the same folder as task evidence for now. Set
  // NGO_APPLICATION_DOCS_FOLDER_ID once a dedicated folder exists.
  NGO_APPLICATION_DOCS:
    process.env.NGO_APPLICATION_DOCS_FOLDER_ID || process.env.INDIVIDUAL_TASK_EVIDENCE_FOLDER_ID,
};

interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

interface StorageUploadResult {
  fileUrl: string;
  nodeId: string;
  fileName: string;
}

const authHeaders = () => {
  if (!FILE_STORAGE_API_KEY || !FILE_STORAGE_API_SECRET) {
    throw new Error(
      "FILE_STORAGE_API_KEY / FILE_STORAGE_API_SECRET are not set on the server"
    );
  }
  return {
    "X-API-KEY": FILE_STORAGE_API_KEY,
    "X-API-SECRET": FILE_STORAGE_API_SECRET,
  };
};

const getUploadToken = async (folderId: string): Promise<string> => {
  const res = await fetch(`${FILE_STORAGE_API_URL}/nodes/${folderId}/upload-token`, {
    method: "POST",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || `Failed to get an upload token for folder ${folderId}`);
  }
  return data.upload_token as string;
};

const uploadFileToStorage = async (
  file: UploadedFile,
  folderId: string
): Promise<StorageUploadResult> => {
  const uploadToken = await getUploadToken(folderId);

  const formData = new FormData();
  formData.append("file", new Blob([new Uint8Array(file.buffer)], { type: file.mimetype }), file.originalname);
  formData.append("parent_id", folderId);
  formData.append("upload_token", uploadToken);

  const res = await fetch(`${FILE_STORAGE_API_URL}/nodes/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data?.message || "File upload to storage failed");
  }

  return {
    fileUrl: data.file_url,
    nodeId: data.node?._id,
    fileName: data.file_name,
  };
};

/**
 * What controllers actually call: pick a context, hand it a file buffer,
 * get back a permanent file_url ready to store in the database.
 */
export const uploadForContext = async (
  context: UploadContext,
  file: UploadedFile
): Promise<StorageUploadResult> => {
  const folderId = FOLDER_ID_BY_CONTEXT[context];
  if (!folderId) {
    throw new Error(`No folder id configured for upload context "${context}"`);
  }
  return uploadFileToStorage(file, folderId);
};