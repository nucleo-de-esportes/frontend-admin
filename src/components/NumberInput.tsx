import React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import type { SxProps, Theme } from "@mui/material/styles";

type NumberInputProps = {
  label?: string;
  error?: boolean;
  sx?: SxProps<Theme>;
  helperText?: React.ReactNode;
  variant?: TextFieldProps["variant"];
} & Omit<NumericFormatProps<TextFieldProps>, "customInput" | "onValueChange"> & {
  onValueChange?: NumericFormatProps<TextFieldProps>["onValueChange"];
};

export default function NumberInput({
  label = "Número",
  error = false,
  helperText = "",
  variant = "outlined",
  sx,
  onValueChange,
  ...props
}: NumberInputProps) {
  return (
    <NumericFormat<TextFieldProps>
      {...props}
      required
      customInput={TextField}
      label={label}
      error={error}
      helperText={helperText}
      variant={variant}
      onValueChange={onValueChange}
      sx={{ width: '100%', mt: 0, mb:2, ...sx }}
    />
  );
}
