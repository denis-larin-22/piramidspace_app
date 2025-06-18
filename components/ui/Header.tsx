import {
    Image,
    TouchableOpacity,
    View,
    StyleSheet,
    ViewStyle,
    Pressable,
    Modal,
    Text,
} from "react-native";
import { Colors } from "../../theme/colors";
import { useState } from "react";
import AnimatedWrapper from "../animation/AnimatedWrapper";
import { Fonts } from "../../theme/fonts";
import { HomeScreenNavigationProp } from "../../screens/MainScreen";
import { CommonActions } from "@react-navigation/native";
import { removeData } from "../../lib/async-storage/acyncStorage";
import {
    ASYNC_STORAGE_USER_INFO_OBJECT,
    ASYNC_STORAGE_USER_LOGIN,
    ASYNC_STORAGE_USER_PHONE_NUMBER,
} from "../../lib/async-storage/asyncStorageKeys";

function Header({
    style,
    navigation,
}: {
    style?: ViewStyle;
    navigation: HomeScreenNavigationProp;
}) {
    const [isExitVissible, setIsExitVissible] = useState<boolean>(false);

    return (
        <View style={[styles.container, style]}>
            <Pressable onPress={() => setIsExitVissible(true)}>
                <Image
                    source={require("../../assets/adaptive-icon.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Pressable>

            <View style={styles.rightControls}>
                <TouchableOpacity style={styles.bellWrapper}>
                    <View style={styles.bellDot} />
                    <Image
                        source={require("../../assets/main-screen/bell.png")}
                        style={styles.bellImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            <ExitModal
                isVissible={isExitVissible}
                setIsVissible={setIsExitVissible}
                navigation={navigation}
            />
        </View>
    );
}

export default Header;

function ExitModal({
    isVissible,
    setIsVissible,
    navigation,
}: {
    isVissible: boolean;
    setIsVissible: (value: boolean) => void;
    navigation: HomeScreenNavigationProp;
}) {
    const exitHandler = () => {
        removeData(ASYNC_STORAGE_USER_LOGIN);
        removeData(ASYNC_STORAGE_USER_PHONE_NUMBER);
        removeData(ASYNC_STORAGE_USER_INFO_OBJECT);

        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "LoginScreen" }],
            })
        );
    };

    return (
        <Modal visible={isVissible} transparent>
            <AnimatedWrapper offsetY={50} style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Pressable
                        style={styles.modalCloseButton}
                        onPress={() => setIsVissible(false)}
                    >
                        <Image
                            source={require("../../assets/main-screen/close-icon.png")}
                            style={styles.modalCloseIcon}
                        />
                    </Pressable>

                    <Pressable
                        style={styles.modalExitButton}
                        onPress={exitHandler}
                    >
                        <Text style={styles.modalExitButtonText}>Вийти з аккаунту</Text>
                    </Pressable>
                </View>
            </AnimatedWrapper>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logo: {
        width: 34,
        height: 21,
    },
    rightControls: {
        flexDirection: "row",
        alignItems: "center",
        gap: 19,
    },
    bellWrapper: {
        width: 22,
        height: 25,
        position: "relative",
    },
    bellDot: {
        width: 8,
        height: 8,
        borderRadius: 100,
        backgroundColor: Colors.red,
        position: "absolute",
        zIndex: 10,
        right: 2,
        top: -2,
    },
    bellImage: {
        width: "100%",
        height: "100%",
        position: "relative",
    },
    modalOverlay: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#00000070",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    modalContainer: {
        padding: 40,
        backgroundColor: Colors.pale,
        borderRadius: 20,
        position: "relative",
    },
    modalCloseButton: {
        width: 20,
        height: 20,
        position: "absolute",
        top: 10,
        right: 10,
    },
    modalCloseIcon: {
        width: 20,
        height: 20,
    },
    modalExitButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: "#E63946",
        borderRadius: 12,
    },
    modalExitButtonText: {
        color: "white",
        fontFamily: Fonts.comfortaa600,
        fontSize: 12,
    },
});
