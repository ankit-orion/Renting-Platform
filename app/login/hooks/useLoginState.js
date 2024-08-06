import { useState } from 'react';

export const useLoginState = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    const [serverSuccess, setServerSuccess] = useState("");

    return {
        isLoading,
        serverError,
        serverSuccess,
        setIsLoading,
        setServerError,
        setServerSuccess
    };
};
