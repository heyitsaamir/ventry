import React, { useLayoutEffect } from "react";
import { useNav } from "./Routes";
import { RightNavItemContainer, NavIcon } from "./RightNavItemContainer";

export interface RightNavButton {
  name: string;
  type: string;
  onPress: () => void;
}

interface Options {
  title: string;
  rightButtons: RightNavButton[];
}

const useCustomNav = (options: Partial<Options>) => {
  const nav = useNav();
  useLayoutEffect(() => {
    const { title, rightButtons } = options;
    nav.setOptions({
      title,
      headerRight: rightButtons
        ? ({ tintColor }) => (
            <RightNavItemContainer>
              {rightButtons.map((buttonOptions, key) => (
                <NavIcon {...buttonOptions} color={tintColor} key={`nav-button-${key}`} />
              ))}
            </RightNavItemContainer>
          )
        : undefined,
    });
  }, [nav, options]);
};

export default useCustomNav;
