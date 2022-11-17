/**
 * @author Junaid Atari
 * @link https://github.com/blacksmoke26
 * @since 2020-09-20
 */

import { useState, useEffect } from "react";
import { debounce } from "debounce";

export enum Breakpoint {
  SIZE_XS = 0,
  SIZE_SM = 576,
  SIZE_MD = 768,
  SIZE_LG = 992,
  SIZE_XL = 1200,
  SIZE_XXL = 1440,
}

const resolveBreakpoint = (width: number): Breakpoint => {
  if (width < Breakpoint.SIZE_SM) {
    return Breakpoint.SIZE_XS;
  } else if (width >= Breakpoint.SIZE_SM && width < Breakpoint.SIZE_MD) {
    return Breakpoint.SIZE_SM;
  } else if (width >= Breakpoint.SIZE_MD && width < Breakpoint.SIZE_LG) {
    return Breakpoint.SIZE_MD;
  } else if (width >= Breakpoint.SIZE_LG && width < Breakpoint.SIZE_XL) {
    return Breakpoint.SIZE_LG;
  } else if (width >= Breakpoint.SIZE_XL && width < Breakpoint.SIZE_XXL) {
    return Breakpoint.SIZE_XL;
  }

  return Breakpoint.SIZE_XXL;
};

/** Get Media Query Breakpoints in React */
const useBreakpoint = (): Breakpoint => {
  const [size, setSize] = useState(() => resolveBreakpoint(window.innerWidth));

  useEffect(() => {
    const calcInnerWidth = debounce(function () {
      setSize(resolveBreakpoint(window.innerWidth));
    }, 200);
    window.addEventListener("resize", calcInnerWidth);
    return () => window.removeEventListener("resize", calcInnerWidth);
  }, []);

  return size;
};

export default useBreakpoint;
