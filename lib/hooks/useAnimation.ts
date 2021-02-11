import { useState, useEffect } from "react";
import Animated, { Easing } from "react-native-reanimated";

interface Props { doAnimation: boolean; duration: number; easingFn?: Animated.EasingFunction };
export const useAnimation = ({ doAnimation, duration, easingFn }: Props) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: doAnimation ? 1 : 0,
      duration,
      easing: easingFn ?? Easing.ease,
    }).start();
  }, [doAnimation]);

  return animation;
};
