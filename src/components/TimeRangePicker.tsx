// TimeInput.tsx
import { TextFieldProps } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Dayjs } from "dayjs";

interface TimeInputProps {
  format: string;
  label: string;
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
  error?: boolean;
  helperText?: string;
  textFieldProps?: Partial<TextFieldProps>;
}

export default function TimeInput({
  format,
  label,
  value,
  onChange,
  error,
  helperText,
  textFieldProps,
}: TimeInputProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <TimePicker
        format={format}
        label={label}
        value={value}
        onChange={onChange}
        slotProps={{
          textField: {
            fullWidth: true,
            margin: "normal",
            error,
            helperText,
            ...textFieldProps,
          },
        }}
      />
    </LocalizationProvider>
  );
}
