// Move faster with intuitive React UI tools.
import Typography from '@mui/material/Typography';

function Title({ children, noWrap = true, ...rest }) {
  return (
    <Typography noWrap={noWrap} {...rest}>
      {children}
    </Typography>
  );
}

export default Title;
