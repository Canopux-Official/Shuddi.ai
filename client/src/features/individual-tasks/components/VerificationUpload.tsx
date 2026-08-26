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

type SubmitPayload = {
  evidenceUrls?: string[];
  textResponse?: string;
  mcqAnswer?: MCQAnswers;
};

interface Props {
  type: 'IMAGE' | 'TEXT' | 'MCQ' | 'HYBRID';
  mcqQuestions?: MCQQuestion[];
  onSubmit: (data: SubmitPayload) => void;
  loading: boolean;
}

const MIN_TEXT_LENGTH = 10;

export const VerificationUpload: React.FC<Props> = ({ type, mcqQuestions = [], onSubmit, loading }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [mcqAnswers, setMcqAnswers] = useState<MCQAnswers>({});

  // Object URL for the preview — revoked when the file changes/unmounts.
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  React.useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  // TODO: replace with your real upload call (presigned URL, direct POST, etc).
  const fakeUploadImage = async (file: File): Promise<string> => {
    await new Promise((res) => setTimeout(res, 500));
    return `https://dummy.com/${file.name}-${Date.now()}`;
  };

  const needsText = type === 'TEXT' || type === 'HYBRID';
  const needsImage = type === 'IMAGE' || type === 'HYBRID';
  const needsMcq = type === 'MCQ';

  const isValid = useMemo(() => {
    if (needsMcq) return mcqQuestions.length > 0 && mcqQuestions.every((q) => !!mcqAnswers[q.id]);
    if (type === 'HYBRID') return (text.trim().length >= MIN_TEXT_LENGTH) || !!file;
    if (type === 'TEXT') return text.trim().length >= MIN_TEXT_LENGTH;
    if (type === 'IMAGE') return !!file;
    return false;
  }, [type, text, file, needsMcq, mcqQuestions, mcqAnswers]);

  const handleSubmit = async () => {
    if (needsMcq) {
      onSubmit({ mcqAnswer: mcqAnswers });
      return;
    }

    let imageUrl: string | undefined;
    if (file) imageUrl = await fakeUploadImage(file);

    onSubmit({
      evidenceUrls: imageUrl ? [imageUrl] : undefined,
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

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleSubmit}
        disabled={loading || !isValid}
        sx={{ bgcolor: '#1b5e20', '&:hover': { bgcolor: '#144a18' } }}
      >
        {loading ? 'Submitting...' : 'Submit Proof'}
      </Button>
    </Box>
  );
};