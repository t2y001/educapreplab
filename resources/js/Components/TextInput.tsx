import { InputHTMLAttributes, useEffect, useRef } from 'react';

export default function TextInput({
    type = 'text',
    className = '',
    isFocused = false,
    ...props
}: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean }) {
    const input = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isFocused) {
            input.current?.focus();
        }
    }, []);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ' +
                className
            }
            ref={input}
        />
    );
}
