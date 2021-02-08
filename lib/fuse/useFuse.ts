import React, { useMemo } from "react";
import Fuse from "fuse.js";

export const useFuse = <T>(items: T[], options?: Fuse.IFuseOptions<T>) => {
  const fuse = useMemo(() => new Fuse(items, options), [items, options]);
  return fuse;
};
