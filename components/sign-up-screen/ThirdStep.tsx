import { Image, Text, TextInput, View, StyleSheet } from "react-native";
import { Fonts } from "../../theme/fonts";
import { Colors } from "../../theme/colors";
import { useState } from "react";
import AnimatedWrapper from "../animation/AnimatedWrapper";

const STEP_SCREEN_ID = 3;

function ThirdStep({
    activeScreenStep,
    inputChangeHandler,
    isError
}: {
    activeScreenStep: number;
    inputChangeHandler: (inputValue: string) => void;
    isError: boolean;
}) {
    const today = new Date();
    const formattedDate = {
        dd: String(today.getDate()).padStart(2, "0"),
        mm: String(today.getMonth() + 1).padStart(2, "0"),
        yyyy: String(today.getFullYear())
    };

    const [dateValue, setDateValue] = useState({
        dd: "",
        mm: "",
        yyyy: ""
    });

    if (activeScreenStep !== STEP_SCREEN_ID) return null;

    return (
        <View style={styles.container}>
            <AnimatedWrapper style={styles.imageWrapper} offsetX={80} useScale useOpacity>
                <Image
                    source={require("../../assets/signup-screen/third-step.png")}
                    style={styles.image}
                />
            </AnimatedWrapper>

            <AnimatedWrapper offsetX={80} useScale useOpacity delay={300}>
                <Image
                    source={require("../../assets/signup-screen/third-step-text.png")}
                    style={styles.textImage}
                />
            </AnimatedWrapper>

            <AnimatedWrapper offsetX={80} useScale useOpacity delay={400}>
                <Text style={styles.label}>Дата народження вашого бізнесу</Text>
                <View style={styles.inputRow}>
                    <View style={styles.inputBlock}>
                        <Text style={styles.inputLabel}>День</Text>
                        <TextInput
                            placeholder={formattedDate.dd}
                            inputMode="numeric"
                            placeholderTextColor={Colors.gray}
                            maxLength={2}
                            keyboardType="numeric"
                            style={[styles.input, isError && styles.inputError, { width: 40 }]}
                            onChangeText={(value) => {
                                setDateValue({ ...dateValue, dd: value });
                                inputChangeHandler(`${value}.${dateValue.mm}.${dateValue.yyyy}`);
                            }}
                        />
                    </View>
                    <View style={styles.inputBlock}>
                        <Text style={styles.inputLabel}>Місяць</Text>
                        <TextInput
                            placeholder={formattedDate.mm}
                            inputMode="numeric"
                            placeholderTextColor={Colors.gray}
                            maxLength={2}
                            keyboardType="numeric"
                            style={[styles.input, isError && styles.inputError, { width: 40 }]}
                            onChangeText={(value) => {
                                setDateValue({ ...dateValue, mm: value });
                                inputChangeHandler(`${dateValue.dd}.${value}.${dateValue.yyyy}`);
                            }}
                        />
                    </View>
                    <View style={styles.inputBlock}>
                        <Text style={styles.inputLabel}>Рік</Text>
                        <TextInput
                            placeholder={formattedDate.yyyy}
                            inputMode="numeric"
                            placeholderTextColor={Colors.gray}
                            maxLength={4}
                            keyboardType="numeric"
                            style={[styles.input, isError && styles.inputError, { width: 100 }]}
                            onChangeText={(value) => {
                                setDateValue({ ...dateValue, yyyy: value });
                                inputChangeHandler(`${dateValue.dd}.${dateValue.mm}.${value}`);
                            }}
                        />
                    </View>
                </View>
            </AnimatedWrapper>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 54
    },
    imageWrapper: {
        width: 344,
        height: 164,
        position: "relative"
    },
    image: {
        height: "100%",
        resizeMode: "contain",
        position: "absolute",
        right: "-20%"
    },
    textImage: {
        height: 87,
        width: 353,
        resizeMode: "contain",
        marginTop: 109
    },
    label: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 16,
        marginTop: 50,
        marginBottom: 6,
        paddingLeft: 16
    },
    inputRow: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 20,
        marginBottom: 150
    },
    inputBlock: {
        alignItems: "center",
        gap: 16
    },
    inputLabel: {
        fontFamily: Fonts.openSans400,
        fontSize: 14,
        color: Colors.gray
    },
    input: {
        padding: 10,
        backgroundColor: "white",
        borderRadius: 31,
        color: "black",
        textAlign: "center",
        borderWidth: 1,
        borderColor: "white"
    },
    inputError: {
        borderColor: Colors.red
    }
});

export default ThirdStep;
