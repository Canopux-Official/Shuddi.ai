/**
 * Uploads a file through OUR backend (POST /api/file-storage/upload),
 * which forwards it to the friend's file-storage API server-side.
 * `context` picks the destination folder — see FOLDER_ID_BY_CONTEXT in
 * server/src/gateway/services/fileStorage.service.ts.
 *
 * Returns the permanent file_url straight from their API — per your
 * friend it doesn't expire, so it's safe to store directly (e.g. in
 * TaskSubmission.evidenceUrls or an NGOApplicationDocument.url).
 */

export type UploadContext = "TASK_EVIDENCE" | "NGO_APPLICATION_DOCS";

interface UploadResult {
  fileUrl: string;
  nodeId: string;
  fileName: string;
}

export const uploadFile = async (
  file: File,
  context: UploadContext
): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("context", context);

  // Plain fetch here (not the shared axios `api` instance) so the browser
  // sets the multipart Content-Type + boundary itself rather than fighting
  // the instance's default "application/json" header.
  const token = localStorage.getItem("authToken");

  const res = await fetch("/api/file-storage/upload", {
    method: "POST",
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "File upload failed");
  }
  return data;
};