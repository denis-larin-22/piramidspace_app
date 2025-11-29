import { ImageBackground, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import AnimatedWrapper from "../animation/AnimatedWrapper";
import { Fonts } from "../../theme/fonts";

export function CloseButton({ closeHandler, style }: { closeHandler: () => void, style?: StyleProp<ViewStyle> }) {
    return (
        <AnimatedWrapper delay={200} useOpacity offsetY={-30}>
            <Pressable style={[styles.button, style]} onPress={closeHandler}>
                <ImageBackground
                    source={require('../../assets/gradient-small.png')}
                    style={styles.buttonBg}
                >
                    <Text style={[styles.closeButtonText, styles.rotate]}>+</Text>
                </ImageBackground>
            </Pressable>
        </AnimatedWrapper>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 59,
        height: 59,
        borderRadius: 50,
        overflow: 'hidden',
    },
    buttonBg: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 40,
        lineHeight: 50,
        color: 'white'
    },
    rotate: {
        transform: [{ rotate: '45deg' }],
    },
})