import { useState, useEffect, useRef, useCallback } from "react";

// This is TS's limitation we can't use generics inside the function when not using inline definitions
// type UseFetchReturnProps = <T, ApiResponse>(
//     url: string,
//     defaultData: T | null,
//     dataUpdateHandler: (result: ApiResponse) => T | null,
//     options?: RequestInit
// ) => {
//     data: T | null,
//     setData: React.Dispatch<React.SetStateAction<T | null>>,
//     error: Error | null,
//     loading: boolean,
//     setLoading: React.Dispatch<React.SetStateAction<boolean>>,
//     refetch: () => Promise<void>,
// }

const useFetch = <T, ApiResponse>(
    url: string,
    defaultData: T | null = null,
    dataUpdateHandler: (result: ApiResponse) => T | null,
    options?: RequestInit): {
        data: T | null,
        setData: React.Dispatch<React.SetStateAction<T | null>>,
        error: Error | null,
        loading: boolean,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        refetch: () => Promise<void>,
    } => {
    const [data, setData] = useState(defaultData);
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

            const result = await response.json() as ApiResponse;
            const transformedData = dataUpdateHandler(result);

            setData(transformedData);

        } catch (err) {
            if (err instanceof Error && err.name !== "AbortError") {
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