import { JSX, useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";

interface AnimatedTransitionProps {
    children: React.ReactNode;
    top: number;
    right: number;
    style?: ViewStyle;
}

function AnimatedAbsolutePosition(props: AnimatedTransitionProps): JSX.Element {
    const { children, top, right, style } = props;

    const topAnim = useRef(new Animated.Value(top)).current;
    const rightAnim = useRef(new Animated.Value(right)).current;

    useEffect(() => {
        Animated.timing(topAnim, {
            toValue: top,
            duration: 300,
            useNativeDriver: false,
        }).start();

        Animated.timing(rightAnim, {
            toValue: right,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [top, right]);

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    top: topAnim,
                    right: rightAnim,
                },
                style,
            ]}
        >
            {children}
        </Animated.View>
    );
};

export default AnimatedAbsolutePosition;