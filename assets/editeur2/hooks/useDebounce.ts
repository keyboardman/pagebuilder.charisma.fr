import { useEffect, useState } from "react";

const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    let timeoutId = undefined;

    if (timeoutId) {
      setIsWaiting(true);
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      setDebouncedValue(value);
      setIsWaiting(false);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return [debouncedValue, isWaiting];
};

export default useDebounce;
