import { Image, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { Colors } from "../../theme/colors";
import AnimatedWrapper, { AnimatedWrapperProps } from "../animation/AnimatedWrapper";

type IButtonAnimWrap = Omit<AnimatedWrapperProps, 'style' | 'children'>;

interface IProps extends IButtonAnimWrap {
    onPressAction: () => void;
    styles?: StyleProp<ViewStyle>;
}

function BackButton({ styles, onPressAction, ...animatedWrapperProps }: IProps) {
    return (
        <AnimatedWrapper
            {...animatedWrapperProps}
            style={styles}
        >
            <TouchableOpacity
                style={localStyles.button}
                onPress={onPressAction}
            >
                <AnimatedWrapper
                    useOpacity
                    offsetX={-30}
                    delay={300}
                >
                    <Image
                        source={require('../../assets/arrow-back.png')}
                        style={localStyles.image}
                    />
                </AnimatedWrapper>
            </TouchableOpacity>
        </AnimatedWrapper>
    );
}

const localStyles = StyleSheet.create({
    button: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: Colors.blue,
        alignItems: 'center',
        justifyContent: 'center',

        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        // Android shadow
        elevation: 5,
    },
    image: {
        width: 20,
        height: 20,
        resizeMode: "contain",
        position: "relative",
        top: 1,
    }
});

export default BackButton;
