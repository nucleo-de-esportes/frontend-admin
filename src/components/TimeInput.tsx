// TimeInput.tsx
import { TextFieldProps } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Dayjs } from "dayjs";
import type { SxProps, Theme } from "@mui/material/styles";

interface TimeInputProps {
  format: string;
  label: string;
  sx?: SxProps<Theme>;
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
  sx,
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
            required: true,
            fullWidth: true,
            margin: "normal",
            error,
            helperText,
            ...textFieldProps,
          },
        }}
        sx={{ width: '47.5%', mt: 0, mb: 2, ...sx }}
      />
    </LocalizationProvider>
  );
}
