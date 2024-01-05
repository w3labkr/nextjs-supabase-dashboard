import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full py-6">
      <Container>
        <Typography variant="body2" color="text.secondary" align="center">
          &copy; {' 2023-2024. '}
        </Typography>
      </Container>
    </footer>
  );
}
