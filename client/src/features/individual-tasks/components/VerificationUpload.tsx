import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface Props {
  type: string;
  onSubmit: (data: unknown) => void;
  loading: boolean;
}

export const VerificationUpload: React.FC<Props> = ({ type, onSubmit, loading }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);

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
        onClick={() => onSubmit({ text, file })}
        disabled={loading}
        sx={{ bgcolor: '#1b5e20', '&:hover': { bgcolor: '#144a18' } }}
      >
        Submit Proof
      </Button>
    </Box>
  );
};