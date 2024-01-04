import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Box component="footer" sx={{ paddingTop: 6 }}>
      <Typography variant="body2" color="text.secondary" align="center">
        &copy; {' 2023-2024. '}
      </Typography>
    </Box>
  );
}
