import { FC, useState } from "react";

import CrossIcon from "public/img/cross.svg";

interface Props {
  text: string;
  openedByDefault?: boolean;
  position?: "first" | "last" | "between";
  id?: string;
  theme?: "light" | "dark";
}

const ContentWrapper: FC<Props> = ({
  text,
  children,
  openedByDefault,
  position,
  id,
  theme
}) => {
  const [isOpened, setIsOpened] = useState(openedByDefault);
  const isLight = theme === "light";

  const textColor = (condition = isLight) =>
    condition ? "text-grey-650" : "text-white";
  const bgColor = (condition = isLight) =>
    condition ? "bg-grey-650" : "bg-white";
  const borderColor = (condition = isLight) =>
    condition ? "border-grey-300" : "border-grey-100";

  const icon = !isOpened ? (
    <div className="w-2 transform rotate-45 ${textColor">
      <CrossIcon />
    </div>
  ) : (
    <div className="text-3xl">-</div>
  );

  const shouldDisplayButtonBorder = isOpened
    ? borderColor(!isLight)
    : "border-transparent";

  const borderStyle =
    position === "between"
      ? "border"
      : position === "first"
      ? "border-t border-l border-r"
      : "border-b border-l border-r";

  const toggleSection = () => setIsOpened(!isOpened);

  return (
    <div
      className={`flex flex-col ${bgColor(
        !isLight
      )} ${textColor()} ${borderStyle} ${borderColor(!isLight)}`}
      id={id}
    >
      <button
        className={`flex border-b ${shouldDisplayButtonBorder} py-2 px-3 w-full justify-between items-center`}
        onClick={toggleSection}
      >
        <span className="text-xl text-light text-left">{text}</span>
        <div
          className={`${bgColor(
            !isLight
          )} w-6 h-6 ml-1 flex items-center justify-center`}
        >
          {icon}
        </div>
      </button>
      <div className={isOpened ? "block" : "hidden"}>{children}</div>
    </div>
  );
};

ContentWrapper.defaultProps = {
  text: "Текст",
  openedByDefault: false,
  position: "between",
  theme: "light"
};

export default ContentWrapper;
