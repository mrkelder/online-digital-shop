import { FC, MouseEvent, TouchEvent } from "react";

const MobileDialog: FC<{
  opened: boolean;
  onClose?: () => void;
}> = ({ children, opened, onClose }) => {
  const variant = opened ? "block" : "hidden";

  const stopPropagation = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`fixed bg-grey-transparent w-screen h-screen top-0 left-0 z-50 ${variant}`}
      onClick={onClose}
    >
      <div onClick={stopPropagation}>{children}</div>
    </div>
  );
};

export default MobileDialog;
