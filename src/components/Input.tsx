import React, { useState } from "react";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

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
    if (props.validation && (type === "text" || type === "password")) {
      try {
        props.validation.parse(value);
        setError(null);
        props.onValidationChange?.(true);
      } catch (err) {
        if (err instanceof z.ZodError) {
          setError(err.errors[0].message);
          props.onValidationChange?.(false);
        }
        console.log(error);
      }
    }
    props.onChange?.(event);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputTypes: Record<string, () => React.ReactElement> = {
    text: () => (
      <input
        type="text"
        value={props.value}
        onChange={handleChange}
        onBlur={props.onBlur}
        placeholder={props.placeholder}
        className={`w-full px-4 py-2 text-lg border border-gray-300 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-[#662C9288] focus:border-[#662C9288] placeholder-[#662C9288] ${props.className}`}
      />
    ),
    password: () => (
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          value={props.value}
          onChange={handleChange}
          onBlur={props.onBlur}
          placeholder={props.placeholder}
          className={`w-full px-4 py-2 text-lg border border-gray-300 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-[#662C9288] focus:border-[#662C9288] placeholder-[#662C9288] ${props.className}`}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
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
    )
  };

  const renderInput = inputTypes[type];

  return (
    <div
      className={`flex ${type === 'text' || type === 'password' ? 'flex-col' : 'flex-row'} gap-1 ${props.className ? ' w-max' : 'w-full'}`}
      style={{
        minWidth: props.minWidth || 'auto',
        maxWidth: props.maxWidth || 'auto',
      }}
    >
      {(type === 'text' || type === 'password') && props.label && (
        <label className="w-max block text-2xl font-medium mb-2 text-gray-900">{props.label}</label>
      )}
      {renderInput && renderInput()}
      {(type === 'text' || type === 'password') && error && (
        <span className="text-red-500 text-sm">{error}</span>
      )}
    </div>
  );
};

export default Input;