import { useState, useEffect } from "react";

interface ReturnValue {
  isLoaded: boolean;
  isMobile: boolean | null;
}

function useMatchMedia(desktopBreakpoint = 1024): ReturnValue {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState<ReturnValue["isMobile"]>(null);

  useEffect(() => {
    function handleMatchMedia() {
      const matchMedia = window.matchMedia(
        `(min-width: ${desktopBreakpoint}px)`
      );
      setIsMobile(!matchMedia.matches);
      setIsLoaded(true);
    }

    handleMatchMedia();

    addEventListener("resize", handleMatchMedia);

    return () => {
      removeEventListener("resize", handleMatchMedia);
    };
  }, [desktopBreakpoint]);

  return { isLoaded, isMobile };
}

export default useMatchMedia;
