import { FC, useEffect, useState } from "react";
import LoadingIcon from "public/img/loading.svg";

const Loading: FC<{ isLoading: boolean }> = ({ isLoading }) => {
  const [display, setDisplay] = useState<"hidden" | "flex">();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isLoading) {
      setDisplay("flex");
    } else {
      timeout = setTimeout(() => {
        setDisplay("hidden");
      }, 1000);
    }
    return () => {
      if (timeout) clearInterval(timeout);
    };
  }, [isLoading]);

  return (
    <div
      className={`w-full top-0 left-0 bg-white z-30 h-full absolute ${display} justify-center items-center ${
        !isLoading ? "animate-disappear" : ""
      }`}
    >
      <span className="w-10 text-red box-content animate-spin">
        <LoadingIcon />
      </span>
    </div>
  );
};

export default Loading;
