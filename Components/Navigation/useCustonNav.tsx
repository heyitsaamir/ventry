import React, { useLayoutEffect } from "react";
import { useNav } from "./Routes";
import { RightNavItemContainer, NavIcon } from "./RightNavItemContainer";

export interface RightNavButtonOptions {
  name: string;
  type: string;
  onPress: () => void;
}

export type RightNavButtonElement = (props: { tintColor?: string }) => JSX.Element;

interface Options {
  title?: string;
  rightButtons?: RightNavButtonOptions[] | RightNavButtonElement;
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
              {rightButtons instanceof Function
                ? rightButtons({ tintColor })
                : rightButtons.map((buttonOptions, key) => {
                    return <NavIcon {...buttonOptions} color={tintColor} key={`nav-button-${key}`} />;
                  })}
            </RightNavItemContainer>
          )
        : undefined,
    });
  }, [nav, options]);
};

export default useCustomNav;
