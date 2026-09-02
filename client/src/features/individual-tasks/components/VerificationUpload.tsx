import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import type { MCQAnswers, MCQQuestion } from '../../../utils/individualTask.type';
import { uploadFile } from '../../../apis/fileStorage/fileStorage.api';

type SubmitPayload = {
  evidenceUrls?: string[];
  textResponse?: string;
  mcqAnswer?: MCQAnswers;
};

interface Props {
  type: 'IMAGE' | 'TEXT' | 'MCQ' | 'HYBRID' | 'BEFORE_AFTER';
  mcqQuestions?: MCQQuestion[];
  onSubmit: (data: SubmitPayload) => void;
  loading: boolean;
}

const MIN_TEXT_LENGTH = 10;

export const VerificationUpload: React.FC<Props> = ({ type, mcqQuestions = [], onSubmit, loading }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  // BEFORE_AFTER needs two independent images — kept separate from `file`
  // so the single-image (IMAGE/HYBRID) path is untouched.
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [mcqAnswers, setMcqAnswers] = useState<MCQAnswers>({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Object URL for the preview — revoked when the file changes/unmounts.
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  React.useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const beforePreviewUrl = useMemo(() => (beforeFile ? URL.createObjectURL(beforeFile) : null), [beforeFile]);
  React.useEffect(() => () => { if (beforePreviewUrl) URL.revokeObjectURL(beforePreviewUrl); }, [beforePreviewUrl]);

  const afterPreviewUrl = useMemo(() => (afterFile ? URL.createObjectURL(afterFile) : null), [afterFile]);
  React.useEffect(() => () => { if (afterPreviewUrl) URL.revokeObjectURL(afterPreviewUrl); }, [afterPreviewUrl]);

  const needsText = type === 'TEXT' || type === 'HYBRID';
  const needsImage = type === 'IMAGE' || type === 'HYBRID';
  const needsBeforeAfter = type === 'BEFORE_AFTER';
  const needsMcq = type === 'MCQ';

  const isValid = useMemo(() => {
    if (needsMcq) return mcqQuestions.length > 0 && mcqQuestions.every((q) => !!mcqAnswers[q.id]);
    if (type === 'HYBRID') return (text.trim().length >= MIN_TEXT_LENGTH) || !!file;
    if (type === 'TEXT') return text.trim().length >= MIN_TEXT_LENGTH;
    if (type === 'IMAGE') return !!file;
    // Both images are required — the backend rejects the submission
    // outright (400) if either is missing, so gate it here too.
    if (needsBeforeAfter) return !!beforeFile && !!afterFile;
    return false;
  }, [type, text, file, beforeFile, afterFile, needsBeforeAfter, needsMcq, mcqQuestions, mcqAnswers]);

  const handleSubmit = async () => {
    if (needsMcq) {
      onSubmit({ mcqAnswer: mcqAnswers });
      return;
    }

    // The file-storage API returns a file_url that doesn't expire, so
    // (unlike the previous browser-upload draft) we can store it directly.
    let evidenceUrls: string[] | undefined;

    if (needsBeforeAfter) {
      if (beforeFile && afterFile) {
        setUploadError(null);
        setUploading(true);
        try {
          // Order matters: the backend reads evidenceUrls[0] as "before"
          // and evidenceUrls[1] as "after" positionally, so upload/collect
          // them in that fixed order rather than in parallel with
          // Promise.all (which wouldn't guarantee the array order matches
          // which button the user actually used).
          const beforeResult = await uploadFile(beforeFile, 'TASK_EVIDENCE');
          const afterResult = await uploadFile(afterFile, 'TASK_EVIDENCE');
          evidenceUrls = [beforeResult.fileUrl, afterResult.fileUrl];
        } catch (err) {
          setUploadError(err instanceof Error ? err.message : 'Upload failed, please try again.');
          setUploading(false);
          return;
        }
        setUploading(false);
      }
    } else if (file) {
      setUploadError(null);
      setUploading(true);
      try {
        const result = await uploadFile(file, 'TASK_EVIDENCE');
        evidenceUrls = [result.fileUrl];
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Upload failed, please try again.');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    onSubmit({
      evidenceUrls,
      textResponse: text.trim() || undefined,
    });
  };

  return (
    <Box>
      {needsMcq && (
        <Box mb={2}>
          {mcqQuestions.length === 0 && (
            <Typography color="text.secondary" variant="body2">
              No questions loaded for this task yet.
            </Typography>
          )}
          {mcqQuestions.map((q, idx) => (
            <FormControl key={q.id} fullWidth sx={{ mb: 3 }}>
              <Typography fontWeight={700} gutterBottom>
                {idx + 1}. {q.question}
              </Typography>
              <RadioGroup
                value={mcqAnswers[q.id] ?? ''}
                onChange={(e) => setMcqAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
              >
                {q.options.map((opt) => (
                  <FormControlLabel key={opt.id} value={opt.id} control={<Radio />} label={opt.text} />
                ))}
              </RadioGroup>
            </FormControl>
          ))}
        </Box>
      )}

      {needsText && (
        <Box mb={2}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Describe your action..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            helperText={
              type === 'TEXT' && text.length > 0 && text.trim().length < MIN_TEXT_LENGTH
                ? `A few more details would help (min ${MIN_TEXT_LENGTH} characters).`
                : ' '
            }
          />
        </Box>
      )}

      {needsImage && (
        <Box mb={2}>
          {!file ? (
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ height: 100, borderStyle: 'dashed', borderColor: '#bdbdbd' }}
            >
              Upload Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </Button>
          ) : (
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid #e0e0e0',
                height: 180,
              }}
            >
              <Box
                component="img"
                src={previewUrl ?? undefined}
                alt="Selected proof"
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <IconButton
                size="small"
                onClick={() => setFile(null)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      )}

      {needsBeforeAfter && (
        <Box mb={2} display="flex" gap={2} flexWrap="wrap">
          <BeforeAfterSlot
            label="Before"
            file={beforeFile}
            previewUrl={beforePreviewUrl}
            onSelect={setBeforeFile}
            onClear={() => setBeforeFile(null)}
          />
          <BeforeAfterSlot
            label="After"
            file={afterFile}
            previewUrl={afterPreviewUrl}
            onSelect={setAfterFile}
            onClear={() => setAfterFile(null)}
          />
        </Box>
      )}

      {uploadError && (
        <Typography color="error" variant="body2" sx={{ mb: 1 }}>
          {uploadError}
        </Typography>
      )}

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleSubmit}
        disabled={loading || uploading || !isValid}
        sx={{ bgcolor: '#1b5e20', '&:hover': { bgcolor: '#144a18' } }}
      >
        {uploading
          ? (needsBeforeAfter ? 'Uploading photos...' : 'Uploading photo...')
          : loading
          ? 'Submitting...'
          : 'Submit Proof'}
      </Button>
    </Box>
  );
};

// One labeled upload slot ("Before" or "After") — mirrors the single-image
// upload/preview/clear UI above, just reused for two independent files.
const BeforeAfterSlot: React.FC<{
  label: string;
  file: File | null;
  previewUrl: string | null;
  onSelect: (file: File | null) => void;
  onClear: () => void;
}> = ({ label, file, previewUrl, onSelect, onClear }) => (
  <Box flex="1 1 45%" minWidth={140}>
    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
      {label}
    </Typography>
    {!file ? (
      <Button
        component="label"
        variant="outlined"
        startIcon={<CloudUploadIcon />}
        fullWidth
        sx={{ height: 100, borderStyle: 'dashed', borderColor: '#bdbdbd' }}
      >
        Upload
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
        />
      </Button>
    ) : (
      <Box
        sx={{
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid #e0e0e0',
          height: 140,
        }}
      >
        <Box
          component="img"
          src={previewUrl ?? undefined}
          alt={`${label} proof`}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <IconButton
          size="small"
          onClick={onClear}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(0,0,0,0.6)',
            color: 'white',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    )}
  </Box>
);