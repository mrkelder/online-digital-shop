import { RefObject } from "react";

function clickOutside(
  e: Event,
  element: RefObject<HTMLElement>,
  func: () => void
) {
  const path = e.composedPath && e.composedPath();
  if (path && !path.includes(element.current as EventTarget)) {
    func();
  }
}

export default clickOutside;
