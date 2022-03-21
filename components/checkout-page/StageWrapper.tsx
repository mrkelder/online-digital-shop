import { FC } from "react";

interface Props {
  stageNumber: number;
  active: boolean;
  title: string;
}

const StageWrapper: FC<Props> = ({ children, stageNumber, active, title }) => {
  const contentVisibilityStyling = active ? "block" : "hidden";
  const headingColorStyling = active ? "red" : "grey-300";
  const headingBorderStyling = active ? "border-b border-grey-100" : "";

  return (
    <div className="bg-white shadow-md border border-grey-100">
      <div className={`flex items-center p-2 ${headingBorderStyling} lg:p-3`}>
        <p
          className={`flex items-center justify-center w-8 h-8 rounded-full bg-${headingColorStyling} text-white text-xl mr-2 lg:w-12 lg:h-12 lg:mr-3`}
        >
          {stageNumber}
        </p>
        <h2 className="flex-1">{title}</h2>
      </div>

      <div className={contentVisibilityStyling + " p-2 lg:p-3"}>{children}</div>
    </div>
  );
};

StageWrapper.defaultProps = {
  stageNumber: 0,
  active: false,
  title: "Этап"
};

export default StageWrapper;
