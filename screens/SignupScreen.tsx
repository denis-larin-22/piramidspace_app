import {
    Animated,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../theme/colors";
import { useState } from "react";
import { Fonts } from "../theme/fonts";
import FirstStep from "../components/sign-up-screen/FirstStep";
import SecondStep from "../components/sign-up-screen/SecondStep";
import ThirdStep from "../components/sign-up-screen/ThirdStep";
import FourthStep from "../components/sign-up-screen/FourthStep";
import { isValidDate } from "../lib/utils";

const initInputsValues = {
    businessName: '',
    businessCity: '',
    businessBirthday: ''
};

const SCREENS_STEPS = [1, 2, 3, 4];

function SignupScreen() {
    const [activeScreenStep, setActiveScreenStep] = useState<number>(SCREENS_STEPS[0]);
    const [inputsValues, setInputsValues] = useState(initInputsValues);
    const [error, setError] = useState<boolean>(false);

    // Switch step handler
    const nextStepHandler = () => {
        const nextScreen = activeScreenStep + 1;
        if (nextScreen > SCREENS_STEPS.length) {
            setActiveScreenStep(SCREENS_STEPS[0]);
        } else {
            setActiveScreenStep(nextScreen);
        }
    };

    // Inputs values handlers (saving to inputsValues state)
    const saveBusinessNameValue = (inputValue: string) => {
        setError(false);
        setInputsValues({ ...inputsValues, businessName: inputValue })
    }
    const saveBusinessCityValue = (inputValue: string) => {
        setError(false);
        setInputsValues({ ...inputsValues, businessCity: inputValue })
    }
    const saveBusinessBirthdayValue = (inputValue: string) => {
        setError(false);
        setInputsValues({ ...inputsValues, businessBirthday: inputValue })
    }

    // Next button handler - check inputs values, set errors, switch step if input value is valid
    const nextButtonHandler = () => {
        switch (activeScreenStep) {
            case 1:
                if (isEmpty(inputsValues.businessName)) {
                    setError(true);
                } else {
                    setError(false);
                    nextStepHandler();
                }
                break;
            case 2:
                if (isEmpty(inputsValues.businessCity)) {
                    setError(true);
                } else {
                    setError(false);
                    nextStepHandler();
                }
                break;
            case 3:
                if (isValidDate(inputsValues.businessBirthday)) {
                    setError(false);
                    nextStepHandler();
                } else {
                    setError(true);
                }
                break;
            default:
                console.log('RESULT:', inputsValues);
                setInputsValues(initInputsValues);
                nextStepHandler();
        }
    };

    return (
        <View style={styles.signUpWrapper}>
            <KeyboardAvoidingView
                style={{ marginBottom: 20 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <StatusBar
                        hidden={false}
                        translucent={false}
                        barStyle="dark-content"
                        backgroundColor={Colors.pale}
                    />

                    <FirstStep activeScreenStep={activeScreenStep} inputChangeHandler={saveBusinessNameValue} isError={error} />
                    <SecondStep activeScreenStep={activeScreenStep} inputChangeHandler={saveBusinessCityValue} isError={error} />
                    <ThirdStep activeScreenStep={activeScreenStep} inputChangeHandler={saveBusinessBirthdayValue} isError={error} />
                    <FourthStep activeScreenStep={activeScreenStep} />
                </ScrollView>
            </KeyboardAvoidingView>

            <NavigationBar
                activeScreenStep={activeScreenStep}
                screenSteps={SCREENS_STEPS}
                nextButtonHandler={nextButtonHandler}
                skipButtonHandler={nextStepHandler}
            />
        </View>
    );
};

export default SignupScreen;

const styles = StyleSheet.create({
    signUpWrapper: {
        flex: 1,
        backgroundColor: Colors.pale,
        justifyContent: 'space-between',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
        marginHorizontal: 20
    },
    wrap: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.pale,
        justifyContent: 'space-between'
    },
    nav: {
        paddingHorizontal: 20,
        marginBottom: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    pagination: {
        flexDirection: 'row',
        gap: 5
    },
    paginationItem: {
        height: 9,
        borderRadius: 100,
    },
    buttonsWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    skipBtnText: {
        marginRight: 15,
        fontFamily: Fonts.comfortaa600,
        fontSize: 14,
        color: Colors.gray
    },
    nextBtn: {
        height: 50,
        borderRadius: 50,
        overflow: 'hidden',
    },
    nextBtnBcg: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row-reverse'
    },
    nextBtnText: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 16,
        color: 'white',
        marginRight: 22,
        lineHeight: 20
    },
});

// ui
function NavigationBar({ activeScreenStep, screenSteps, nextButtonHandler, skipButtonHandler }:
    {
        activeScreenStep: number,
        screenSteps: Array<number>,
        nextButtonHandler: () => void,
        skipButtonHandler: () => void
    }) {

    const isThirdStep = activeScreenStep === 3;

    return (
        <View style={styles.nav}>
            <Pagination
                activeScreenStep={activeScreenStep}
                screenSteps={screenSteps}
            />

            <View
                style={styles.buttonsWrap}
            >
                <TouchableOpacity
                    onPress={skipButtonHandler}
                >
                    <Text
                        style={[styles.skipBtnText, {
                            display: isThirdStep ? 'none' : 'flex'
                        }]}
                    >Пропустити</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.nextBtn, {
                        width: isThirdStep ? '100%' : 50,
                    }]}
                    onPress={nextButtonHandler}
                >
                    <ImageBackground
                        style={styles.nextBtnBcg}
                        source={isThirdStep ?
                            require('../assets/gradient.png')
                            :
                            require('../assets/gradient-small.png')
                        }
                    >
                        <Image
                            source={isThirdStep ?
                                require('../assets/signup-screen/long-white-arrow.png')
                                :
                                require('../assets/signup-screen/white-arrow.png')
                            }
                            style={{
                                height: 15,
                                width: isThirdStep ? 85 : 23,
                                position: isThirdStep ? 'absolute' : 'relative',
                                right: isThirdStep ? 14 : 0,
                                resizeMode: 'contain',
                            }}
                        />
                        {isThirdStep ?
                            <Text
                                style={styles.nextBtnText}
                            >Завершити</Text>
                            :
                            null
                        }
                    </ImageBackground>
                </TouchableOpacity>
            </View>
        </View>
    )
}

function Pagination({ activeScreenStep, screenSteps }: { activeScreenStep: number, screenSteps: Array<number> }) {
    return (
        <>
            {
                activeScreenStep === 3 ?
                    null
                    :
                    <View style={styles.pagination}>
                        {screenSteps.slice(0, 3).map((step, index) => (
                            <Animated.View
                                key={step + index}
                                style={[
                                    styles.paginationItem,
                                    {
                                        backgroundColor: activeScreenStep === step ? Colors.blue : '#D9D9D9',
                                        width: activeScreenStep === step ? 23 : 9
                                    }
                                ]}
                            />
                        ))}
                    </View>
            }
        </>
    );
};

// utils
function isEmpty(value: string) { return value.trim().length === 0 };