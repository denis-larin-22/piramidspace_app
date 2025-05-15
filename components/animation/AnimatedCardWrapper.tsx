import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface AnimatedWrapperProps {
    children: React.ReactNode;
    index: number;
    duration?: number;
    delayFactor?: number;
    translateYInitial?: number;
    style?: ViewStyle;
}

function AnimatedCardWrapper({
    children,
    index,
    duration = 500,
    delayFactor = 20,
    translateYInitial = 30,
    style = {},
}: AnimatedWrapperProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(translateYInitial)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration,
                delay: delayFactor * (index === 0 ? 0.5 : index),
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration,
                delay: delayFactor * (index === 0 ? 0.5 : index),
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                {
                    opacity: fadeAnim,
                    transform: [{ translateY }],
                },
                style,
            ]}
        >
            {children}
        </Animated.View>
    );
};

export default AnimatedCardWrapper;