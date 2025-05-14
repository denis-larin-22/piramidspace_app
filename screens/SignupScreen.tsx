import { Animated, Image, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../theme/colors";
import { useEffect, useRef, useState } from "react";
import { Fonts } from "../theme/fonts";
import FirstStep from "../components/sign-up-screen/FirstStep";
import SecondStep from "../components/sign-up-screen/SecondStep";
import FourthStep from "../components/sign-up-screen/FourthStep";
import ThirdStep from "../components/sign-up-screen/ThirdStep";

function SignupScreen() {
    const screenSteps = [1, 2, 3, 4];
    const [activeScreenStep, setActiveScreenStep] = useState<number>(screenSteps[0]);

    const nextStepHandler = () => {
        const nextScreen = activeScreenStep + 1;
        if (nextScreen > screenSteps.length) {
            setActiveScreenStep(screenSteps[0]);
        } else {
            setActiveScreenStep(nextScreen);
        }
    }
    return (
        <View style={styles.wrap}>
            <StatusBar
                hidden={false}
                translucent={false}
                barStyle="dark-content"
                backgroundColor={Colors.pale}
            />

            <FirstStep activeScreenStep={activeScreenStep} />
            <SecondStep activeScreenStep={activeScreenStep} />
            <ThirdStep activeScreenStep={activeScreenStep} />
            <FourthStep activeScreenStep={activeScreenStep} />


            <NavigationBar
                activeScreenStep={activeScreenStep}
                screenSteps={screenSteps}
                nextStepHandler={nextStepHandler}
            />
        </View >
    )
};

export default SignupScreen;

const styles = StyleSheet.create({
    wrap: {
        width: '100%',
        height: '100%',
        padding: 20,
        backgroundColor: Colors.pale,
        justifyContent: 'space-between'
    },
    nav: {
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

function NavigationBar({ activeScreenStep, screenSteps, nextStepHandler }:
    {
        activeScreenStep: number,
        screenSteps: Array<number>
        nextStepHandler: () => void
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
                    onPress={nextStepHandler}
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
                    onPress={nextStepHandler}
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
}