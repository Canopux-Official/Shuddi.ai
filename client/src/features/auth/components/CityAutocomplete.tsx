import React from 'react';
import { Autocomplete, TextField, Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { getAreas, type Area } from '../../../apis/auth/auth';
import type { OnboardingFormData } from '../schemas/schemas';

interface CityAutocompleteProps {
  control: Control<OnboardingFormData>;
  errors: FieldErrors<OnboardingFormData>;
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({ control, errors }) => {
  const [areas, setAreas] = React.useState<Area[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const res = await getAreas();
      if (res.success && res.data) setAreas(res.data);
      setLoading(false);
    })();
  }, []);

  const areaNames = areas.map(a => a.name);

  return (
    <Controller
      name="city"
      control={control}
      render={({ field: { value, onChange } }) => {
        const trimmed = (value || '').trim();
        const isKnownArea = areaNames.some(
          name => name.toLowerCase() === trimmed.toLowerCase()
        );
        const showNotCoveredNote = trimmed.length > 1 && !isKnownArea;

        return (
          <Box>
            <Autocomplete
              freeSolo
              options={areaNames}
              loading={loading}
              inputValue={value || ''}
              onInputChange={(_, newValue) => onChange(newValue)}
              onChange={(_, newValue) => onChange(newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="City"
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              )}
            />

            {showNotCoveredNote && (
              <Box
                sx={{
                  display: 'flex', alignItems: 'flex-start', gap: 1, mt: 1,
                  p: 1.25, borderRadius: 1, bgcolor: 'action.hover',
                }}
              >
                <InfoOutlinedIcon fontSize="small" sx={{ color: 'text.secondary', mt: '2px' }} />
                <Typography variant="caption" color="text.secondary">
                  "{trimmed}" isn't covered by our platform yet. Submitting will send a
                  request to our team — once confirmed, it'll be automatically assigned
                  to your account.
                </Typography>
              </Box>
            )}
          </Box>
        );
      }}
    />
  );
};