import { Autocomplete, FormControl, FormHelperText, FormLabel } from "@mui/joy";

interface FormAutocompleteProps {
  error?: string;
  label?: string;
  options: string[];
}

export default function FormAutocomplete(props: FormAutocompleteProps) {

  return (
    <FormControl error={!!props.error}>
      {props.label ? <FormLabel>{props.label}</FormLabel> : null}
      <Autocomplete options={props.options} />
      {props.error ? <FormHelperText>{props.error}</FormHelperText> : null}  
    </FormControl>
  )
}
