const useLocalStorage = <T>(key: string) => {
    const get = (): T | null => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) as T : null;
        } catch (error) {
            console.error("error reading localStorage", error);
            return null;
        }
    };

    const set = (value: T) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("error writing localStorage", error);
        }
    };

    const remove = () => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error("error removing localStorage", error);
        }
    };

    return { get, set, remove };
}

export default useLocalStorage