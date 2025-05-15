import { Image, Text, TextInput, View, StyleSheet } from "react-native";
import { Fonts } from "../../theme/fonts";
import { Colors } from "../../theme/colors";
import AnimatedWrapper from "../animation/AnimatedWrapper";

const STEP_SCREEN_ID = 2;

function SecondStep({
    activeScreenStep,
    inputChangeHandler,
    isError
}: {
    activeScreenStep: number;
    inputChangeHandler: (inputValue: string) => void;
    isError: boolean;
}) {
    if (activeScreenStep !== STEP_SCREEN_ID) {
        return null;
    } else {
        return (
            <View style={styles.container}>
                <AnimatedWrapper
                    style={styles.imageWrapper}
                    offsetX={80}
                    useScale
                    useOpacity
                >
                    <Image
                        source={require("../../assets/signup-screen/second-step.png")}
                        style={styles.image}
                    />
                </AnimatedWrapper>

                <AnimatedWrapper
                    offsetX={80}
                    useScale
                    useOpacity
                    delay={300}
                >
                    <Image
                        source={require("../../assets/signup-screen/second-step-text.png")}
                        style={styles.textImage}
                    />
                </AnimatedWrapper>

                <AnimatedWrapper
                    offsetX={80}
                    useScale
                    useOpacity
                    delay={400}
                >
                    <Text style={styles.label}>Ваше місто</Text>
                    <TextInput
                        placeholder="Введіть назву вашого міста"
                        placeholderTextColor={Colors.gray}
                        onChangeText={inputChangeHandler}
                        style={[
                            styles.input,
                            isError && { borderColor: Colors.red }
                        ]}
                    />
                </AnimatedWrapper>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 54
    },
    imageWrapper: {
        width: 486,
        height: 222,
        position: "relative"
    },
    image: {
        height: "100%",
        resizeMode: "contain",
        position: "absolute",
        left: "-25%"
    },
    textImage: {
        height: 75,
        width: 353,
        resizeMode: "contain",
        marginTop: 58
    },
    label: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 16,
        marginTop: 50,
        marginBottom: 6,
        paddingLeft: 16
    },
    input: {
        backgroundColor: "white",
        paddingVertical: 10,
        paddingLeft: 16,
        borderRadius: 31,
        color: "black",
        borderWidth: 1,
        borderColor: "white",
        marginBottom: 100
    }
});

export default SecondStep;
