import { View, Text, TextInput, TouchableOpacity, Image, Dimensions, ImageBackground, StyleSheet, ButtonProps, Modal, Alert, Pressable } from "react-native";
import { Colors } from "../theme/colors";
import { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppStack";
import Loader from "../components/ui/Loader";
import ErrorNotification from "../components/ui/ErrorNotification";
import { Fonts } from "../theme/fonts";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginScreen'>;

function LoginScreen({ navigation }: { navigation: HomeScreenNavigationProp }) {
    const [loginValue, setLoginValue] = useState<string>("");
    const [passwordValue, setPasswordValue] = useState<string>("");

    const [loginError, setLoginError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);

    const [isPasswordHide, setIsPasswordHide] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [modalErrorVisible, setModalErrorVisible] = useState(false);

    const loginButtonHandler = () => {
        const value = 'test';

        if (loginValue.length === 0) {
            setLoginError(true);
        }

        if (passwordValue.length === 0) {
            setPasswordError(true);
        }

        if (loginValue.length === 0 || passwordValue.length === 0) return;
        setIsLoading(true);


        if (loginValue === value && passwordValue === value) {
            setTimeout(() => {
                setLoginValue("");
                setPasswordValue("");
                setIsLoading(false);
                navigation.navigate('MainScreen');
            }, 1500)
        } else {
            setTimeout(() => {
                setLoginError(true);
                setPasswordError(true);
                console.log("Error!");
                setIsLoading(false);
                setModalErrorVisible(true);
            }, 1500);

            setTimeout(() => {
                setModalErrorVisible(false);
            }, 5000)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.loginForm}>
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
                        setLoginValue(text);
                    }}
                    value={loginValue}
                    placeholder="Введіть свій логін"
                    placeholderTextColor={Colors.gray}
                    style={{
                        ...styles.input,
                        borderColor: loginError ? Colors.red : Colors.pale
                    }}
                />

                <Text style={styles.label}>Пароль</Text>
                <View>
                    <TextInput
                        onChangeText={(text) => {
                            setPasswordError(false);
                            setPasswordValue(text);
                        }}
                        value={passwordValue}
                        placeholder="Введіть свій пароль"
                        placeholderTextColor={Colors.gray}
                        secureTextEntry={isPasswordHide}
                        style={{
                            ...styles.input,
                            borderColor: passwordError ? Colors.red : Colors.pale,
                            marginBottom: 10,
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => { setIsPasswordHide(!isPasswordHide) }}
                        style={styles.hidePasswordButton}>
                        {isPasswordHide ?
                            <Image
                                source={require('../assets/login-screen/open-eye.png')}
                                style={styles.openEyeImage}
                            />
                            :
                            <Image
                                source={require('../assets/login-screen/close-eye.png')}
                                style={styles.closeEyeImage}
                            />
                        }
                    </TouchableOpacity>
                </View>

                <Text style={styles.forgotPassword}>Забули пароль?</Text>

                <LoginButton
                    title="Увійти"
                    onPress={loginButtonHandler}
                />
            </View>

            <Image
                source={require('../assets/login-circles.png')}
                style={styles.decorImage}
            />

            {isLoading && <Loader />}

            <ErrorNotification
                isVissible={modalErrorVisible}
                message="Перевірте логін або пароль"
            />
        </View>
    )
}

export default LoginScreen;

function LoginButton(loginButtonProps: ButtonProps) {
    return (
        <TouchableOpacity
            onPress={loginButtonProps.onPress}
            style={styles.button}
        >
            <ImageBackground source={require('../assets/gradient.png')}>
                <Text style={styles.buttonText} >
                    {loginButtonProps.title}
                </Text>
            </ImageBackground>
        </TouchableOpacity>
    )
}


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
    hidePasswordButton: {
        width: 26,
        height: 15,
        position: 'absolute',
        right: 13,
        top: '25%'
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
    forgotPassword: {
        fontSize: 14,
        color: Colors.blue,
        opacity: 0.8,
        textAlign: "right",
        fontFamily: Fonts.openSans400,
    },
});