// Runtime type checking for React props and similar objects
import PropTypes from 'prop-types';

// React Hooks for form state management and validation (Web + React Native).
import { useController, useForm } from 'react-hook-form';

// Move faster with intuitive React UI tools.
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import MuiCheckbox from '@mui/material/Checkbox';

function Checkbox({ control, name, ...rest }) {
  const {
    field,
    fieldState: { invalid, isTouched, isDirty, error },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name,
    control,
  });

  return (
    <>
      <FormControlLabel
        onChange={field.onChange} // send value to hook form
        onBlur={field.onBlur} // notify when input is touched/blur
        value={field.value} // input value
        name={field.name} // send down the input name
        inputRef={field.ref} // send input ref, so we can focus on input when error appear
        control={<MuiCheckbox />}
        {...rest}
      />
      {error && <FormHelperText error={!!error}>{error?.message}</FormHelperText>}
    </>
  );
}

Checkbox.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
};

export default Checkbox;
