import React from "react";
import { TextField, TextFieldVariants } from "@mui/material";

interface CustomTextFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  type?: string;
  fullWidth?: boolean;
  variant?: TextFieldVariants;
}

export default function CustomTextField({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
  type = "text",
  fullWidth = true,
  variant = "outlined",
  ...props
}: CustomTextFieldProps) {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      type={type}
      fullWidth={fullWidth}
      variant={variant}
      {...props}
    />
  );
}
