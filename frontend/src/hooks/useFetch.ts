import { useState, useEffect, useRef, useCallback } from "react";

const useFetch = <T = any>(url: string, defaultData: any = null, dataUpdateHandler: (result: any) => T | null, options?: RequestInit) => {
    const [data, setData] = useState<T | null>(defaultData);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(async () => {
        abortControllerRef.current?.abort();

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(
                    `Error: ${response.status} ${response.statusText}`
                );
            }

            const result = await response.json();
            const transformedData = dataUpdateHandler(result);

            setData(transformedData);

        } catch (err: any) {
            if (err.name !== "AbortError") {
                setError(err);
            }
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();

        return () => {
            abortControllerRef.current?.abort();
        };
    }, [fetchData]);

    return {
        data,
        setData,
        error,
        loading,
        setLoading,
        refetch: fetchData
    };
};

export default useFetch;