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
import { useNavigation } from "@react-navigation/native";
import { removeData } from "../../lib/async-storage/acyncStorage";
import {
    ASYNC_STORAGE_USER_INFO_OBJECT,
    ASYNC_STORAGE_USER_LOGIN,
    ASYNC_STORAGE_USER_PHONE_NUMBER,
} from "../../lib/async-storage/asyncStorageKeys";
import NotificationsBell from "../main-screen/notifications/NotificationsBell";

function Header({
    style,
}: {
    style?: ViewStyle;
}) {
    const [isExitVissible, setIsExitVissible] = useState<boolean>(false);
    const navigation = useNavigation<HomeScreenNavigationProp>();

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
                <NotificationsBell />
            </View>
        </View>
    );
}

export default Header;

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
});
