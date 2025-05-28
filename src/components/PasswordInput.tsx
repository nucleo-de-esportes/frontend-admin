import React from "react";
import { z } from "zod";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

type ZodStringCheck = {
    kind: string;
    value?: unknown;
    regex?: RegExp;
    message?: string;
};

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    validation?: z.ZodString;
    showPassword: boolean;
    togglePasswordVisibility: () => void;
    error: string | null;
}

const PasswordInput = ({ validation, showPassword, togglePasswordVisibility, error, ...props }: PasswordInputProps) => {
    const checkPasswordRules = (checks: ZodStringCheck[], value: string, hasError: boolean): { isMet: boolean; text: string; key: string }[] => {
        return checks.map((check, index) => {
            const text = check.message || `Regra ${check.kind || index + 1}`;
            let isMet = false;

            if (check.kind === 'min' && typeof check.value === 'number') {
                isMet = value.length >= check.value;
            } else if (check.kind === 'regex' && check.regex instanceof RegExp) {
                isMet = check.regex.test(value);
            } else {
                isMet = !hasError;
            }

            return { isMet, text, key: `${check.kind}-${index}` };
        });
    };

    const checks = validation?._def?.checks ?? [];
    const rules = checkPasswordRules(checks, String(props.value || ''), !!error);

    return (
        <>
            <div className="relative w-full">
                <input
                    type={showPassword ? "text" : "password"}
                    name={props.name}
                    placeholder={props.placeholder}
                    {...props}
                    className={`w-full px-4 py-2 text-lg border border-gray-300 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-[#662C9288] focus:border-[#662C9288] placeholder-[#662C9288] ${props.className || ''}`}
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>

            {rules.length > 0 && (
                <ul className="mt-2 list-none p-0 space-y-1 text-sm">
                    {rules.map(({ isMet, text, key }) => (
                        <li key={key} className={`flex items-center ${isMet ? 'text-green-600' : 'text-red-500'}`}>
                            {isMet ? (
                                <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0" />
                            ) : (
                                <XCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            )}
                            {text}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default PasswordInput;