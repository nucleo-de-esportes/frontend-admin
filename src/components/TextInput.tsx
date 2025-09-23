import React, { useState } from "react";
import {
    TextField,
    TextFieldVariants,
    Box,
    Typography,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { CheckCircle, Cancel, Visibility, VisibilityOff } from "@mui/icons-material";
import { z } from "zod";

type ZodStringCheck = {
    kind: string;
    value?: unknown;
    regex?: RegExp;
    message?: string;
};

interface CustomTextFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    fullWidth?: boolean;
    variant?: TextFieldVariants;
    validation?: z.ZodString;
}

export default function CustomTextField({
    label,
    name,
    value,
    onChange,
    type = "text",
    fullWidth = true,
    variant = "outlined",
    validation,
    ...props
}: CustomTextFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    const checkValidationRules = (
        checks: ZodStringCheck[],
        inputValue: string
    ): { isMet: boolean; text: string; key: string }[] => {
        return checks.map((check, index) => {
            let text = check.message || `Regra ${check.kind || index + 1}`;
            let isMet = false;

            if (check.kind === "min" && typeof check.value === "number") {
                isMet = inputValue.length >= check.value;
            } else if (check.kind === "max" && typeof check.value === "number") {
                isMet = inputValue.length <= check.value;
            } else if (check.kind === "regex" && check.regex instanceof RegExp) {
                isMet = check.regex.test(inputValue);
            } else if (check.kind === "email") {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isMet = emailRegex.test(inputValue);
                
                // Definir mensagem específica para email baseada no estado
                if (isMet) {
                    text = "E-mail válido";
                } else {
                    text = "Formato de e-mail inválido";
                }
            } else {
                // Para regras genéricas, validar usando o schema completo
                const result = validation?.safeParse(inputValue);
                isMet = result?.success || false;
            }

            return { isMet, text, key: `${check.kind}-${index}` };
        });
    };

    const checks = validation?._def?.checks ?? [];
    const rules = checkValidationRules(checks, value);

    return (
        <Box sx={{ width: "100%" }}>
            <TextField
                label={label}
                name={name}
                value={value}
                onChange={onChange}
                type={type === "password" && !showPassword ? "password" : "text"}
                fullWidth={fullWidth}
                variant={variant}
                {...props}
                slotProps={{
                    input: {
                        endAdornment:
                            type === "password" ? (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ) : undefined,
                    },
                }}
            />

            {rules.length > 0 && (
                <Box sx={{ mt: 1 }}>
                    {rules.map(({ isMet, text, key }) => (
                        <Box
                            key={key}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 0.5,
                                color: isMet ? "success.main" : "error.main",
                            }}
                        >
                            {isMet ? (
                                <CheckCircle sx={{ fontSize: 16, mr: 1 }} />
                            ) : (
                                <Cancel sx={{ fontSize: 16, mr: 1 }} />
                            )}
                            <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                                {text}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}