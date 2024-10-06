import { type ColorPaletteProp, FormControl, FormHelperText, FormLabel, Textarea } from "@mui/joy";
import type { SxProps } from "@mui/joy/styles/types";

interface FormInputProps
  extends Omit<React.InputHTMLAttributes<HTMLTextAreaElement & HTMLDivElement>, "size"> {
  color?: ColorPaletteProp;
  size?: "sm" | "md" | "lg";
  error?: string;
  label?: string;
  minRows?: number;
  sx?: SxProps;
}

export default function FormTextArea(props: FormInputProps) {
  const { label, error, ...rest } = props;
  return (
    <FormControl error={!!error}>
      {label ? <FormLabel>{label}</FormLabel> : null}
      <Textarea {...rest} />
      {error ? <FormHelperText color="">{error}</FormHelperText> : null}
    </FormControl>
  );
}
