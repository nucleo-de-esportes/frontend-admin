import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ElementType;
    size?: 'sm' | 'md' | 'lg';
    text: string;
    minWidth?: string;
}

const Button = ({ size = 'md', color = '#BF0087', ...props }: ButtonProps) => {
    const sizeStyles = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    return (
        <button
            type="button"
            onClick={props.onClick}
            className={`
                ${props.className || ''}
                ${props.disabled ? 'opacity-60 cursor-not-allowed' : 'hover:scale-102 active:scale-98'}
                flex items-center justify-center gap-2 text-white ${sizeStyles[size]} 
                text-lg font-semibold rounded-lg 
                shadow-md transition-transform transform 
                cursor-pointer min-w-max w-full sm:w-3/4
            `}
            style={{
                backgroundColor: color,
                minWidth: props.minWidth || 'auto'
            }}
            disabled={props.disabled}
        >
            {props.icon && <span className="icon">{React.createElement(props.icon)}</span>}
            {props.text}
        </button>
    );
};

export default Button;