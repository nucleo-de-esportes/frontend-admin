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

        if (props.validation && type === "text") {
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

    const inputTypes: Record<string, () => React.ReactElement> = {
        text: () => (
            <input
                type="text"
                value={props.value}
                onChange={handleChange}
                placeholder={props.placeholder}
                className="px-4 py-2 text-lg border rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-[#662C9266] focus:border-[#662C9266] placeholder-[#662C9266]"
            />
        ),
        radio: () => (
            <div className="flex items-center gap-2">
                <input
                    type="radio"
                    {...props}
                    onChange={handleChange}
                    className="w-5 h-5 text-[#662C9266] focus:ring-[#662C9266]"
                />
                {props.label && <span className="text-lg text-gray-900">{props.label}</span>}
            </div>
        )
    };

    const renderInput = inputTypes[type];

    return (
        <div 
            className={`flex ${type === 'text' ? 'flex-col' : 'flex-row'} gap-1`}
            style={{
                minWidth: props.minWidth || 'auto'
            }}
        >
            {type === 'text' && props.label && <label className="text-2xl font-semibold text-gray-900">{props.label}</label>}
            {renderInput()}
            {type === 'text' && error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
    );
};

export default Input;