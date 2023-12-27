// Move faster with intuitive React UI tools.
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function Footer() {
  // &copy; 2023. CORP. All rights reserved.
  // &copy; 2023-2024.
  return (
    <Box component="footer" sx={{ py: 6 }}>
      <Container>
        <Typography variant="body2" color="text.secondary" align="center">
          &copy; {' 2023-2024. '}
        </Typography>
      </Container>
    </Box>
  );
}
