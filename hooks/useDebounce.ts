import { useEffect, useRef } from "react";

const TIME = 500;

type ReturnValue = (callback: () => void) => void;

function useDebounce(time = TIME): ReturnValue {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function debounce(callback: () => void) {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(callback, time);
  }

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return debounce;
}

export default useDebounce;
