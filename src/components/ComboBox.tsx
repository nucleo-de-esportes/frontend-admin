import { Autocomplete, TextField } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

export type ComboBoxOption = {
  value: number;
  label: string;
};

export interface ComboBoxProps {
  label: string;
  options: ComboBoxOption[];
  value: ComboBoxOption | null;
  onChange: (value: ComboBoxOption | null) => void;
  placeholder?: string;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

export default function ComboBox({
  label,
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  disabled = false,
  sx,
}: ComboBoxProps) {
  return (
    <Autocomplete<ComboBoxOption, false, false, false>
      disablePortal
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} />
      )}
      disabled={disabled}
      sx={{ width: 300, ...sx }}
    />
  );
}
