import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    options: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    minWidth?: string;
    label?: string;
    name?: string;
    disabled?: boolean;
}

export function Select({ placeholder = 'Selecione uma opção', disabled = false, ...props }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = props.options.find(option => option.value === props.value);

    const handleSelect = (option: SelectOption) => {
        props.onChange?.(option.value);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" style={{ minWidth: props.minWidth || 'auto' }}>
            {props.label && (
                <label
                    htmlFor={props.name}
                    className="block text-2xl font-medium mb-2 text-gray-900"
                >
                    {props.label}
                </label>
            )}
            <button
                type="button"
                id={props.name}
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    relative w-full px-4 py-3.5 text-left
                    bg-white border rounded-lg shadow-inner
                    focus:outline-none focus:ring-2 focus:ring-[#662C9288] focus:border-[#662C9288]
                    disabled:bg-gray-50 disabled:text-gray-500
                    transition-colors duration-200
                    ${isOpen ? 'border-[#662C9288]' : 'border-gray-300'}
                `}
            >
                <span className={`block truncate ${!selectedOption ? 'text-gray-500' : 'text-gray-900'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <ChevronDown
                        className={`h-6 w-6 text-[#662C92] transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                    />
                </span>
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
                    <ul className="py-1 max-h-60 overflow-auto">
                        {props.options.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => handleSelect(option)}
                                className={`
                                    px-4 py-2 cursor-pointer select-none
                                    hover:bg-purple-50 hover:text-[#662C92]
                                    ${option.value === props.value ? 'bg-purple-50 text-[#662C92]' : 'text-gray-900'}
                                `}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}