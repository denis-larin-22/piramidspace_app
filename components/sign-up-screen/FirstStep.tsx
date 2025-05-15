import { Image, Text, TextInput, View, StyleSheet } from "react-native";
import { Fonts } from "../../theme/fonts";
import { Colors } from "../../theme/colors";
import AnimatedWrapper from "../animation/AnimatedWrapper";

const STEP_SCREEN_ID = 1;

function FirstStep({
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
                        source={require("../../assets/signup-screen/first-step.png")}
                        style={styles.image}
                    />
                </AnimatedWrapper>

                <AnimatedWrapper
                    offsetX={80}
                    useScale
                    useOpacity
                    delay={300}
                >
                    <Text style={styles.title}>
                        Як ви назвали свій <Text style={styles.highlight}>бізнес</Text>?
                    </Text>
                </AnimatedWrapper>

                <AnimatedWrapper
                    offsetX={80}
                    useScale
                    useOpacity
                    delay={400}
                >
                    <Text style={styles.label}>Назва</Text>
                    <TextInput
                        placeholder="Введіть назву вашого бізнесу"
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
        width: 450,
        height: 252,
        position: "relative"
    },
    image: {
        height: "100%",
        resizeMode: "contain",
        position: "absolute",
        right: 0
    },
    title: {
        marginTop: 52,
        fontFamily: Fonts.comfortaa700,
        fontSize: 36,
        textTransform: "uppercase"
    },
    highlight: {
        color: Colors.blue
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

export default FirstStep;
