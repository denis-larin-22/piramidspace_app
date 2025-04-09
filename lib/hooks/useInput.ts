import { useState } from 'react';

interface UseInputFieldReturn {
    value: string;
    error: boolean;
    onChange: (text: string) => void;
    setError: (value: boolean) => void;
    reset: () => void;
}

export function useInput(initialValue = ''): UseInputFieldReturn {
    const [value, setValue] = useState<string>(initialValue);
    const [error, setError] = useState<boolean>(false);

    const onChange = (text: string) => {
        setValue(text);
        if (error) setError(false);
    };

    const reset = () => {
        setValue('');
        setError(false);
    };

    return {
        value,
        error,
        onChange,
        setError,
        reset,
    };
};