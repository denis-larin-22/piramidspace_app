import { useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
    LayoutChangeEvent,
    ViewStyle
} from "react-native";
import { Colors } from "../../theme/colors";
import { Fonts } from "../../theme/fonts";

interface Props {
    styles: ViewStyle
    option1: string;
    option2: string;
    switchState: boolean;
    switchHandler: (state: boolean) => void;
}

function Switcher({
    styles,
    option1,
    option2,
    switchState,
    switchHandler
}: Props) {

    const translateX = useRef(new Animated.Value(switchState ? 1 : 0)).current;
    const widthRef = useRef(0);

    useEffect(() => {
        Animated.spring(translateX, {
            toValue: switchState ? 1 : 0,
            useNativeDriver: true,
            friction: 8,
            tension: 80
        }).start();
    }, [switchState]);

    const onLayout = (e: LayoutChangeEvent) => {
        widthRef.current = e.nativeEvent.layout.width;
    };

    const sliderTranslate = translateX.interpolate({
        inputRange: [0, 1],
        outputRange: [4, widthRef.current / 2]
    });

    return (
        <Pressable
            style={[s.wrapper, styles]}
            onPress={() => switchHandler(!switchState)}
            onLayout={onLayout}
        >
            <Animated.View
                style={[
                    s.slider,
                    { transform: [{ translateX: sliderTranslate }] }
                ]}
            />

            <Text style={[
                s.label,
                !switchState && s.activeLabel
            ]}>
                {option1}
            </Text>

            <Text style={[
                s.label,
                switchState && s.activeLabel
            ]}>
                {option2}
            </Text>
        </Pressable>
    );
}

const s = StyleSheet.create({
    wrapper: {
        width: 160,
        height: 32,
        borderRadius: 22,
        backgroundColor: "#F2F5FB",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 4,

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4
    },

    slider: {
        position: "absolute",
        width: "50%",
        height: 24,
        borderRadius: 18,
        backgroundColor: Colors.blue,

        shadowColor: Colors.blue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6
    },

    label: {
        flex: 1,
        textAlign: "center",
        fontFamily: Fonts.comfortaa600,
        fontSize: 12,
        lineHeight: 14,
        color: "#7A869A"
    },

    activeLabel: {
        color: "white"
    }
});

export default Switcher;