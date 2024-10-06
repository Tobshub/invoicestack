import { type ColorPaletteProp, FormControl, FormHelperText, FormLabel, Input } from "@mui/joy";
import type { SxProps } from "@mui/joy/styles/types";

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  color?: ColorPaletteProp;
  size?: "sm" | "md" | "lg";
  error?: string;
  label?: string;
  horizontal?: boolean;
  sx?: SxProps;
  controlSx?: SxProps;
  startDecorator?: React.ReactNode;
  endDecorator?: React.ReactNode;
}

export default function FormInput(props: FormInputProps) {
  const { label, error, horizontal, controlSx, ...rest } = props;
  return (
    <FormControl
      error={!!error}
      sx={horizontal ? { flexDirection: "row", gap: 2, ...controlSx } : controlSx}
    >
      {label ? (
        <FormLabel sx={horizontal ? { alignSelf: "center" } : undefined}>{label}</FormLabel>
      ) : null}
      <Input {...rest} />
      {error ? <FormHelperText color="">{error}</FormHelperText> : null}
    </FormControl>
  );
}
