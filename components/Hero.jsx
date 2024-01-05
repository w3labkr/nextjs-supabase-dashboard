import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function Hero() {
  return (
    <div className="pt-12 pb-8">
      <Container>
        <Typography component="h1" variant="h2" color="text.primary" align="center" gutterBottom>
          Album layout
        </Typography>
        <Typography variant="h5" color="text.secondary" align="center" paragraph>
          Something short and leading about the collection below—its contents, the creator, etc.
          <br />
          Make it short and sweet, but not too short so folks don&apos;t simply skip over it entirely.
        </Typography>
      </Container>
    </div>
  );
}
