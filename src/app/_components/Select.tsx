import { Select, Option } from "@mui/joy";

interface FormSelectProps {
 primitive: Parameters<typeof Select>[0];
  options: {label: string, value: string }[];
}

export default function FormSelect(props: FormSelectProps) {
  return (
    <Select {...props.primitive}>
      {props.options.map((o, idx) => (
        <Option value={o.value} key={idx}>
          {o.label}
        </Option>
      ))}
    </Select>
  )
}
