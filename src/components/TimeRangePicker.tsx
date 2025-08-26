import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimeRangePicker } from "@mui/x-date-pickers-pro/TimeRangePicker";
import { TextFieldProps } from "@mui/material/TextField";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";

interface TimeRangeInputProps {
  value: [Dayjs | null, Dayjs | null];
  onChange: (newValue: [Dayjs | null, Dayjs | null]) => void;
}

export default function TimeRangeInput({ value, onChange }: TimeRangeInputProps) {
  const hasError =
    value[0] && value[1] && dayjs(value[0]).isAfter(dayjs(value[1]));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <TimeRangePicker
        value={value}
        onChange={onChange}
        format="HH:mm"
        localeText={{ start: "Horário de Início", end: "Horário de Fim" }}
        slotProps={{
          textField: [
            {
              fullWidth: true,
              margin: "normal",
              label: "Início",
            },
            {
              fullWidth: true,
              margin: "normal",
              label: "Fim",
              error: hasError,
              helperText: hasError
                ? "O horário de fim deve ser maior que o de início"
                : "",
            },
          ] as unknown as TextFieldProps, 
        }}
      />
    </LocalizationProvider>
  );
}
