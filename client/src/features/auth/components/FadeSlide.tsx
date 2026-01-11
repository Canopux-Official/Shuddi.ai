import { Box, type BoxProps } from '@mui/material';

export const FadeSlide = ({ children, ...props }: BoxProps) => (
  <Box
    sx={{
      animation: 'fadeInUp 0.5s ease-out',
      '@keyframes fadeInUp': {
        '0%': { opacity: 0, transform: 'translateY(20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
      width: '100%',
    }}
    {...props}
  >
    {children}
  </Box>
);