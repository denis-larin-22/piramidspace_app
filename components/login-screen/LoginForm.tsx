import { useEffect, useState } from "react";
import { useInput } from "../../lib/hooks/useInput";
import { formatPhoneNumberToInternational, formatToLowerCase, isValidPhoneNumber } from "../../lib/utils";
import { ButtonProps, Image, ImageBackground, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Colors } from "../../theme/colors";
import { Fonts } from "../../theme/fonts";
import ErrorNotification from "../ui/ErrorNotification";
import Loader from "../ui/Loader";
import { LoginScreenNavigationProp } from "../../screens/LoginScreen";
import { saveDataToAcyncStorage } from "../../lib/async-storage/acyncStorage";
import { ASYNC_STORAGE_USER_INFO_OBJECT, ASYNC_STORAGE_USER_LOGIN, ASYNC_STORAGE_USER_PHONE_NUMBER } from "../../lib/async-storage/asyncStorageKeys";
import AnimatedWrapper from "../animation/AnimatedWrapper";
import { getAuth } from "../../lib/api/auth";
import { CommonActions } from "@react-navigation/native";

function LoginForm({ navigation, isInternetConnected }: { navigation: LoginScreenNavigationProp, isInternetConnected: boolean }) {
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    //   login value
    const {
        value: loginValue,
        onChange: onLoginChange,
        error: loginError,
        setError: setLoginError,
    } = useInput("");
    // phone number value
    const {
        value: phoneNumberValue,
        onChange: onPhoneNumberChange,
        error: phoneNumberError,
        setError: setPhoneNumberError,
    } = useInput("");

    // loading
    const [isLoading, setIsLoading] = useState<boolean>(false); // Loading auth state
    // error notif.
    const [modalErrorVisible, setModalErrorVisible] = useState<boolean>(false); // Error notification state
    const [noNumberInDatabaseError, setNoNumberInDatabaseError] = useState<boolean>(false); // no number in the data base error

    // Button handler
    const loginButtonHandler = async () => {
        const isLoginValueValid = loginValue.length !== 0;
        const isPhoneNumberValueValid = isValidPhoneNumber(phoneNumberValue);

        if (!isLoginValueValid) setLoginError(true);
        if (!isPhoneNumberValueValid) setPhoneNumberError(true);
        if (!isLoginValueValid || !isPhoneNumberValueValid) return;

        // Start auth
        setIsLoading(true);
        Keyboard.dismiss(); // hide keyboard

        const login = formatToLowerCase(loginValue).trim();
        const phoneNumber = formatPhoneNumberToInternational(phoneNumberValue);

        const authResponseResult = await getAuth(login, phoneNumber); // Auth

        if (authResponseResult !== undefined) {
            // CHECK IF THERE IS USER NUMBER IN THE ACCOUNT IN THE DATA BASE !!!
            const isThereNumber = typeof authResponseResult.cellphone_dill === 'string' && authResponseResult.cellphone_dill.length > 0;

            if (isThereNumber) {
                // saving login, phoneNumber values and user info to the Async Storage
                saveDataToAcyncStorage(ASYNC_STORAGE_USER_LOGIN, login);
                saveDataToAcyncStorage(ASYNC_STORAGE_USER_PHONE_NUMBER, phoneNumber);
                saveDataToAcyncStorage(ASYNC_STORAGE_USER_INFO_OBJECT, JSON.stringify(authResponseResult));

                onLoginChange("");
                onPhoneNumberChange("");

                setTimeout(() => {
                    setIsLoading(false);
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'MainScreen' }],
                        })
                    );
                }, 1000);
            } else {
                setNoNumberInDatabaseError(true);
                setIsLoading(false);
                setModalErrorVisible(true);

                setTimeout(() => {
                    setModalErrorVisible(false);
                }, 3000);
            }
        } else {
            setLoginError(true);
            setPhoneNumberError(true);

            setIsLoading(false);
            setModalErrorVisible(true);

            setTimeout(() => {
                setModalErrorVisible(false);
            }, 3000);
        }
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={[styles.loginForm, {
                marginBottom: keyboardVisible ? 150 : 15
            }]}>
                <Text style={styles.loginHeadText}>
                    Привіт, Партнере!
                </Text>
                <Text style={styles.loginText}>
                    Введіть свої дані, щоб увійти у обліковий запис
                </Text>

                <Text style={styles.label}>Логін</Text>
                <TextInput
                    onChangeText={(text) => {
                        setLoginError(false);
                        onLoginChange(text);
                    }}
                    value={loginValue}
                    placeholder="Введіть свій логін"
                    placeholderTextColor={Colors.gray}
                    style={{
                        ...styles.input,
                        borderColor: loginError ? Colors.red : Colors.pale
                    }}
                />

                <Text style={styles.label}>Номер телефону:</Text>
                <TextInput
                    onChangeText={(text) => {
                        setPhoneNumberError(false);
                        onPhoneNumberChange(text);
                    }}
                    value={phoneNumberValue}
                    keyboardType="number-pad"
                    placeholder="+38 067 111 11 11"
                    placeholderTextColor={Colors.gray}
                    style={{
                        ...styles.input,
                        borderColor: phoneNumberError ? Colors.red : Colors.pale,
                        marginBottom: 10,
                    }}
                />

                <LoginButton
                    title="Увійти"
                    onPress={loginButtonHandler}
                />
            </SafeAreaView >

            <Image
                source={require('../../assets/login-circles.png')}
                style={styles.decorImage}
            />

            {isLoading && <Loading />}

            {modalErrorVisible && <ErrorNotification
                message={isInternetConnected ?
                    noNumberInDatabaseError ?
                        "⚠️ Введений номер телефону не прив'язано до акаунту! Зверніться будь ласка до вашого менеджера"
                        :
                        "⚠️ Перевір значення логіна і номеру телефону"
                    :
                    "⚠️ Десь пропало інтернет-з’єднання"
                }
            />}
        </View>
    )
};

export default LoginForm;

// UI

function LoginButton(loginButtonProps: ButtonProps) {
    return (
        <TouchableOpacity
            onPress={loginButtonProps.onPress}
            style={styles.button}
        >
            <ImageBackground source={require('../../assets/gradient.png')}>
                <Text style={styles.buttonText} >
                    {loginButtonProps.title}
                </Text>
            </ImageBackground>
        </TouchableOpacity>
    )
}

function Loading() {
    return (
        <View
            style={styles.loadingContainer}
        >
            <AnimatedWrapper
                useScale
                offsetY={50}
                useOpacity
                style={styles.loadingWrap}
            >
                <Text
                    style={styles.loadingText}
                >🦥 Зачекай...</Text>
                <Loader radius={70} />

            </AnimatedWrapper>
        </View >
    )
}

// Styles

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.pale,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginForm: {
        position: 'relative',
        zIndex: 10,
        backgroundColor: Colors.pale,
        paddingBottom: 20
    },
    loginHeadText: {
        color: Colors.blue,
        textTransform: "uppercase",
        fontFamily: Fonts.comfortaa700,
        fontSize: 26,
        textAlign: "center",
        marginBottom: 15
    },
    loginText: {
        color: "#2B2548",
        fontSize: 14,
        fontFamily: Fonts.openSans400,
        textAlign: "center",
        marginBottom: 55
    },
    label: {
        marginLeft: 16,
        marginBottom: 6,
        fontSize: 16,
        fontFamily: Fonts.comfortaa700
    },
    input: {
        backgroundColor: "white",
        padding: 16,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 31,
        marginBottom: 21,
        borderWidth: 1,
        fontFamily: Fonts.openSans400,
        fontSize: 14
    },
    openEyeImage: {
        height: 15,
        width: 24,
        resizeMode: 'center'
    },
    closeEyeImage: {
        height: 22,
        width: 22,
        resizeMode: 'stretch',
        position: 'relative',
        top: -5
    },
    decorImage: {
        position: "absolute",
        bottom: -80,
        width: 309,
        height: 309,
        resizeMode: 'contain',
        zIndex: 0
    },
    // login button
    button: {
        marginTop: 36,
        borderRadius: 25,
        overflow: "hidden"
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontFamily: Fonts.comfortaa600,
        width: '100%',
        paddingVertical: 12,
        textAlign: "center"
    },
    // loading
    loadingContainer: {
        backgroundColor: "#00000080",
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingWrap: {
        width: 250,
        height: 100,
        backgroundColor: Colors.pale,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 14,
        padding: 10,
        paddingTop: 15
    },
    loadingText: {
        width: '100%',
        textAlign: 'center',
        fontFamily: Fonts.comfortaa600,
        fontSize: 16,
        borderBottomWidth: 1,
        borderColor: "#A2A2A840",
        paddingBottom: 5
    }
});