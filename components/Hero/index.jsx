import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function Hero({ title = '', description = '' }) {
  return (
    <div className="pt-12 pb-8">
      <Container>
        {title && (
          <Typography
            component="h1"
            variant="h2"
            color="text.primary"
            gutterBottom
            className="whitespace-pre-line text-center"
          >
            {title}
          </Typography>
        )}
        {description && (
          <Typography variant="h5" color="text.secondary" paragraph className="whitespace-pre-line text-center">
            {description}
          </Typography>
        )}
      </Container>
    </div>
  );
}
