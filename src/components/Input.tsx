import React, { useState } from "react";
import { z } from "zod";
import PasswordInput from "./PasswordInput";
import TimeInput from "./TimeInput"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  minWidth?: string;
  maxWidth?: string;
  validation?: z.ZodType<unknown>;
  className?: string;
  onValidationChange?: (isValid: boolean) => void;
}

const Input = ({ type = "text", ...props }: InputProps) => {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (props.validation && type === "password") {
      try {
        props.validation.parse(value);
        setError(null);
        props.onValidationChange?.(true);
      } catch (err) {
        if (err instanceof z.ZodError) {
          setError(err.errors[0].message);
          props.onValidationChange?.(false);
        }
      }
    }
    props.onChange?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (props.validation && (type === "text" || type === "time")) {
      try {
        props.validation.parse(value);
        setError(null);
        props.onValidationChange?.(true);
      } catch (err) {
        if (err instanceof z.ZodError) {
          setError(err.errors[0].message);
          props.onValidationChange?.(false);
        }
      }
    }
    props.onBlur?.(event);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handler específico para TimeInput
  const handleTimeChange = (time: string) => {
    // Cria um evento sintético para manter compatibilidade
    const syntheticEvent = {
      target: { value: time, name: props.name },
      currentTarget: { value: time, name: props.name }
    } as React.ChangeEvent<HTMLInputElement>;
    
    props.onChange?.(syntheticEvent);
  };

  const inputTypes: Record<string, () => React.ReactElement> = {
    text: () => (
      <input
        type="text"
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        onBlur={handleBlur}
        placeholder={props.placeholder}
        className={`w-full px-4 py-2 text-lg border border-gray-300 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-[#662C9288] focus:border-[#662C9288] placeholder-[#662C9288] ${props.className}`}
      />
    ),
    password: () => (
      <PasswordInput
        value={typeof props.value === 'string' ? props.value : ''}
        name={props.name}
        onChange={handleChange}
        onBlur={props.onBlur}
        placeholder={props.placeholder}
        validation={props.validation as z.ZodString}
        className={props.className}
        showPassword={showPassword}
        togglePasswordVisibility={togglePasswordVisibility}
        error={error}
      />
    ),
    radio: () => (
      <div className="flex items-center gap-2">
        <input
          type="radio"
          {...props}
          onChange={handleChange}
          className={`w-5 h-5 text-[#662C9288] focus:ring-[#662C9288] ${props.className}`}
        />
        {props.label && <span className="text-lg text-gray-900">{props.label}</span>}
      </div>
    ),
    time: () => (
      <TimeInput
        value={typeof props.value === 'string' ? props.value : ''}
        onChange={handleTimeChange}
        onBlur={handleBlur}
        placeholder={props.placeholder}
        disabled={props.disabled}
        className={props.className || ''}
      />
    )
  };

  const renderInput = inputTypes[type];

  return (
    <div
      className={`flex ${type === 'text' || type === 'password' || type === 'time' ? 'flex-col' : 'flex-row'} gap-1 ${props.className ? ' w-max' : 'w-full'}`}
      style={{
        minWidth: props.minWidth || 'auto',
        maxWidth: props.maxWidth || 'auto',
      }}
    >
      {(type === 'text' || type === 'password' || type === 'time') && props.label && (
        <label className="w-max block text-2xl font-medium mb-2 text-gray-900">{props.label}</label>
      )}
      {renderInput && renderInput()}
      {(type === 'text' || type === 'time') && (
        <span className="text-red-500 text-sm h-2">{error}</span>
      )}
    </div>
  );
};

export default Input;