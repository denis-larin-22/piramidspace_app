import { useState, useEffect } from "react";
import { Colors } from "../../theme/colors";
import {
    StyleProp,
    StyleSheet,
    Switch,
    Text,
    View,
    ViewStyle
} from "react-native";
import { Fonts } from "../../theme/fonts";
import AnimatedWrapper from "../animation/AnimatedWrapper";

function Switcher({
    styles,
    option1,
    option2,
    switchState,
    switchHandler
}: {
    styles?: StyleProp<ViewStyle>,
    option1: string,
    option2: string,
    switchState: boolean,
    switchHandler: (state: boolean) => void
}) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [prevState, setPrevState] = useState(switchState);

    useEffect(() => {
        if (switchState !== prevState) {
            setPrevState(switchState);
            setShowTooltip(true);

            const timer = setTimeout(() => {
                setShowTooltip(false);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [switchState]);

    return (
        <View style={[s.container, styles]}>
            <Text style={s.label}>{option1}</Text>

            <Switch
                trackColor={{ false: "#3372F950", true: "#A2A2A850" }}
                thumbColor={Colors.blue}
                ios_backgroundColor={Colors.blueLight}
                onValueChange={switchHandler}
                value={switchState}
            />

            <Text style={s.label}>{option2}</Text>

            {showTooltip && (
                <AnimatedWrapper
                    offsetY={10}
                    style={s.tooltip}
                >
                    <Text style={s.tooltipText}>
                        {switchState ? option2 : option1}
                    </Text>
                </AnimatedWrapper>
            )}
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },

    label: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 14,
        lineHeight: 16,
        color: Colors.gray
    },

    tooltip: {
        backgroundColor: "white",
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 12,
        position: "absolute",
        top: -30,
        zIndex: 100,

        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        // Android shadow
        elevation: 5,

        borderWidth: 1,
        borderColor: Colors.blueLight
    },

    tooltipText: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 14,
        lineHeight: 18,
        color: Colors.gray
    }
});

export default Switcher;
