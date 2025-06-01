import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';

type AnimatedWrapperProps = {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  offsetX?: number;
  offsetY?: number;
  useOpacity?: boolean;
  useScale?: boolean;
  style?: StyleProp<ViewStyle>;
};

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  duration = 300,
  delay = 0,
  offsetX = 0,
  offsetY = 0,
  useOpacity = true,
  useScale = false,
  style,
}) => {
  const translateX = useRef(new Animated.Value(offsetX)).current;
  const translateY = useRef(new Animated.Value(offsetY)).current;
  const opacity = useRef(new Animated.Value(useOpacity ? 0 : 1)).current;
  const scale = useRef(new Animated.Value(useScale ? 0.8 : 1)).current;

  useEffect(() => {
    const animations = [
      Animated.timing(translateX, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ];

    if (useOpacity) {
      animations.push(
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          delay,
          useNativeDriver: true,
        })
      );
    }

    if (useScale) {
      animations.push(
        Animated.timing(scale, {
          toValue: 1,
          duration,
          delay,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          transform: [
            { translateX },
            { translateY },
            ...(useScale ? [{ scale }] : []),
          ],
          ...(useOpacity ? { opacity } : {}),
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default AnimatedWrapper;
