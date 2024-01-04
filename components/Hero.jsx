import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Hero() {
  return (
    <Box sx={{ paddingTop: 8, paddingBottom: 6 }}>
      <Container>
        <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
          Album layout
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Something short and leading about the collection below—its contents, the creator, etc.
          <br />
          Make it short and sweet, but not too short so folks don&apos;t simply skip over it entirely.
        </Typography>
      </Container>
    </Box>
  );
}
