import { useController, useForm } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import MuiCheckbox from '@mui/material/Checkbox';

export default function Checkbox({ control, name, ...rest }) {
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
      {error && (
        <FormHelperText error={!!error} className="!-mt-2">
          {error.message}
        </FormHelperText>
      )}
    </>
  );
}
