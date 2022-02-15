import { FC } from "react";

interface Props {
  variant?: "left" | "right";
}

const rightClass =
  "absolute w-4/5 h-screen right-0 bg-white flex flex-col animate-slide-right pt-4";

const leftClass =
  "absolute w-4/5 h-screen bg-white flex flex-col animate-slide-left";

const MobileSlideMenu: FC<Props> = ({ variant, children }) => {
  const styles = variant === "left" ? leftClass : rightClass;
  return <div className={styles}>{children}</div>;
};

MobileSlideMenu.defaultProps = {
  variant: "left"
};

export default MobileSlideMenu;
