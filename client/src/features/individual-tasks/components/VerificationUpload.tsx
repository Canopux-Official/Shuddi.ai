import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

type SubmitPayload = {
  evidenceUrls?: string[];
  textResponse?: string;
};

interface Props {
  type: 'IMAGE' | 'TEXT' | 'HYBRID';
  onSubmit: (data: SubmitPayload) => void;
  loading: boolean;
}

export const VerificationUpload: React.FC<Props> = ({ type, onSubmit, loading }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const fakeUploadImage = async (file: File): Promise<string> => {
    await new Promise((res) => setTimeout(res, 500));
    return `https://dummy.com/${file.name}-${Date.now()}`;
  };

  const handleSubmit = async () => {
    let imageUrl: string | undefined;

    if (file) {
      imageUrl = await fakeUploadImage(file);
    }

    onSubmit({
      evidenceUrls: imageUrl ? [imageUrl] : undefined,
      textResponse: text || undefined,
    });
  };

  const isValid =
  (type === 'TEXT' && text) ||
  (type === 'IMAGE' && file) ||
  (type === 'HYBRID' && (text || file));

  return (
    <Box>
      {(type === 'TEXT' || type === 'HYBRID') && (
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Describe your action..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ mb: 2 }}
        />
      )}

      {(type === 'IMAGE' || type === 'HYBRID') && (
        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          fullWidth
          sx={{ height: 100, borderStyle: 'dashed', mb: 2, borderColor: '#bdbdbd' }}
        >
          {file ? file.name : "Upload Photo"}
          <input type="file" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </Button>
      )}

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleSubmit}
        disabled={loading || !isValid}
        sx={{ bgcolor: '#1b5e20', '&:hover': { bgcolor: '#144a18' } }}
      >
        Submit Proof
      </Button>
    </Box>
  );
};