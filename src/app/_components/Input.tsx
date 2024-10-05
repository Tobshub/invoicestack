import { type ColorPaletteProp, FormControl, FormHelperText, FormLabel, Input } from "@mui/joy";

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  color?: ColorPaletteProp;
  size?: "sm" | "md" | "lg";
  error?: string;
  label?: string;
}

export default function FormInput(props: FormInputProps) {
  const { label, error, ...rest } = props;
  return (
    <FormControl error={!!error}>
      {label ? <FormLabel>{label}</FormLabel> : null}
      <Input {...rest} />
      {error ? <FormHelperText color="">{error}</FormHelperText> : null}
    </FormControl>
  );
}
