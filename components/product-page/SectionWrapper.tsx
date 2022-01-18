import { FC, useState } from "react";
import CrossIcon from "public/img/cross.svg";

const SectionWrapper: FC<{
  text: string;
  openedByDefault?: boolean;
  position?: "first" | "last" | "between";
  id?: string;
}> = ({ text, children, openedByDefault, position, id }) => {
  const [isOpened, setIsOpened] = useState(openedByDefault);
  const icon = !isOpened ? (
    <div className="w-2 transform rotate-45">
      <CrossIcon />
    </div>
  ) : (
    <div className="text-3xl w-2 h-0.5 bg-grey-500" />
  );
  const borderStyle =
    position === "between"
      ? "border"
      : position === "first"
      ? "border-t border-l border-r"
      : "border-b border-l border-r";

  const toggleSection = () => {
    setIsOpened(!isOpened);
  };

  return (
    <div
      className={"bg-white border-grey-100 flex flex-col " + borderStyle}
      id={id}
    >
      <button
        className="flex border-b border-grey-100 py-2 px-3 w-full justify-between items-center"
        onClick={toggleSection}
      >
        <span className="text-xl text-light">{text}</span>
        <div className="bg-grey-75 w-6 h-6 flex items-center justify-center">
          {icon}
        </div>
      </button>
      {isOpened && children}
    </div>
  );
};

SectionWrapper.defaultProps = {
  text: "Текст",
  openedByDefault: false,
  position: "between"
};

export default SectionWrapper;
