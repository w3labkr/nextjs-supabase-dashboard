// Runtime type checking for React props and similar objects
import PropTypes from 'prop-types';

// React Hooks for form state management and validation (Web + React Native).
import { useController, useForm } from 'react-hook-form';

// Move faster with intuitive React UI tools.
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';

function Input({ control, name, ...rest }) {
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
      <TextField
        onChange={field.onChange} // send value to hook form
        onBlur={field.onBlur} // notify when input is touched/blur
        value={field.value} // input value
        name={field.name} // send down the input name
        inputRef={field.ref} // send input ref, so we can focus on input when error appear
        {...rest}
      />
      {error && <FormHelperText error={!!error}>{error?.message}</FormHelperText>}
    </>
  );
}

Input.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
};

export default Input;
