import { FormEvent, ReactNode } from 'react';
import Title from './Title';

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
            className={`flex flex-col items-center gap-4 justify-center max-w-4xl px-10 md:px-24 py-10 shadow-lg bg-white ${className}`}
        >
            {title && <Title title={title} className='mb-4'/>}
            {children}
        </form>
    );
};

export default Form;