// Move faster with intuitive React UI tools.
import Box from '@mui/material/Box';

export default function Main({ children }: { children: React.ReactNode }) {
  return <Box component="main">{children}</Box>;
}
