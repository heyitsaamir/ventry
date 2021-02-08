import { useState, useEffect } from "react";
import Animated, { Easing } from "react-native-reanimated";

export const useAnimation = ({ doAnimation, duration }: { doAnimation: boolean; duration: number }) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: doAnimation ? 1 : 0,
      duration,
      easing: Easing.ease,
    }).start();
  }, [doAnimation]);

  return animation;
};
