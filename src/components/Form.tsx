import { FormEvent, ReactNode } from 'react';

interface FormProps {
    title?: string;
    children: ReactNode;
    onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
    className?: string;
}

const Form = ({ title, children, onSubmit, className = '' }: FormProps) => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        if (onSubmit) {
            onSubmit(e);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`flex flex-col items-center gap-4 justify-center w-max px-24 py-10 shadow-lg bg-white ${className}`}
        >
            {title && <h1 className="text-4xl text-[#43054E] font-semibold mb-4">{title}</h1>}
            {children}
        </form>
    );
};

export default Form;