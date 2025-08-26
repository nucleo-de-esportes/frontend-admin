import React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { NumericFormat, NumericFormatProps } from "react-number-format";

type NumberInputProps = {
  label?: string;
  error?: boolean;
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
  onValueChange,
  ...props
}: NumberInputProps) {
  return (
    <NumericFormat<TextFieldProps>
      {...props}
      customInput={TextField}
      label={label}
      error={error}
      helperText={helperText}
      variant={variant}
      onValueChange={onValueChange}
    />
  );
}
