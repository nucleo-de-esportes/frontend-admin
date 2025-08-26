import * as React from "react";
import { Autocomplete, TextField } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

export interface ComboBoxProps<T extends object> {
  label: string;
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Função para extrair o texto que será exibido na lista */
  getOptionLabel: (option: T) => string;
  /** Função para comparar opções e valor selecionado */
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  sx?: SxProps<Theme>;
}

export default function ComboBox<T extends object>({
  label,
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  disabled = false,
  getOptionLabel,
  isOptionEqualToValue,
  sx,
}: ComboBoxProps<T>) {
  const compare = React.useMemo(
    () =>
      isOptionEqualToValue ??
      ((option: T, val: T) => option === val),
    [isOptionEqualToValue]
  );

  return (
    <Autocomplete<T, false, false, false>
      disablePortal
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={compare}
      renderInput={(params) => <TextField {...params} label={label} placeholder={placeholder} />}
      disabled={disabled}
      sx={{ width: 300, ...sx }}
    />
  );
}
