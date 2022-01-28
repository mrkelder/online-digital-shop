import { FC } from "react";

interface Props {
  title: string;
}

const TextBlock: FC<Props> = ({ title, children }) => (
  <div className="bg-white shadow-lg">
    <p className="px-5 pt-4 pb-2 border-b border-grey-100 text-xl font-bold">
      {title}
    </p>
    <div className="px-5 py-2 space-y-4">{children}</div>
  </div>
);

TextBlock.defaultProps = {
  title: "Блок"
};

export default TextBlock;
