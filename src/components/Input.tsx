import React, { useState } from "react";
import { z } from "zod";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    minWidth?: string;
    validation?: z.ZodType<unknown>;
    onValidationChange?: (isValid: boolean) => void;
}

const Input = ({ type = "text", ...props }: InputProps) => {
    const [error, setError] = useState<string | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (props.validation) {
            try {
                props.validation.parse(value);
                setError(null);
                props.onValidationChange?.(true);
            } catch (err) {
                if (err instanceof z.ZodError) {
                    setError(err.errors[0].message);
                    props.onValidationChange?.(false);
                }
                console.log(error)
            }
        }

        props.onChange?.(event);
    };

    return (
        <div className="flex flex-col gap-1"
            style={{
                minWidth: props.minWidth || 'auto'
            }}
        >
            {props.label && <label className="text-2xl font-semibold text-gray-900">{props.label}</label>}

            <input
                type={type}
                value={props.value}
                onChange={handleChange}
                placeholder={props.placeholder}
                className="px-4 py-2 text-lg border rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-[#662C9266] focus:border-[#662C9266] placeholder-[#662C9266]"
            />
        </div>
    );
};

export default Input;