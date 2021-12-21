import { FC, MouseEvent, TouchEvent } from "react";

const Dialog: FC<{
  opened: boolean;
  onClose: () => void;
}> = ({ children, opened, onClose }) => {
  const variant = opened ? "block" : "hidden";

  const closeDialog = () => {
    onClose();
  };

  const stopPropagation = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`absolute bg-grey-transparent w-screen h-screen top-0 left-0 z-20 ${variant}`}
      onClick={closeDialog}
    >
      <div onClick={stopPropagation}>{children}</div>
    </div>
  );
};

export default Dialog;
