import { Image, StyleSheet, Text, View } from "react-native";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";

function NHeader({ unreadNotificationsCount }: { unreadNotificationsCount: number }) {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.iconWrapper}>
                    <Image
                        source={require("../../../assets/main-screen/bell-white.png")}
                        style={styles.bell}
                        resizeMode="contain"
                    />

                    {unreadNotificationsCount !== 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {unreadNotificationsCount}
                            </Text>
                        </View>
                    )}
                </View>

                <Text style={styles.title}>
                    Повідомлення
                </Text>
            </View>

            <Text style={styles.counter}>
                {unreadNotificationsCount === 0 ? "немає" : unreadNotificationsCount} нових
            </Text>
        </View>
    );
}

export default NHeader;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderColor: Colors.grayLight,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
    },

    iconWrapper: {
        width: 35,
        height: 35,
        backgroundColor: Colors.blue,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
    },

    bell: {
        width: 25,
        height: 25,
    },

    badge: {
        width: 20,
        height: 20,
        backgroundColor: Colors.red,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: -10,
        right: -10,
    },

    badgeText: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 12,
        lineHeight: 14,
        color: 'white',
        top: 1,
    },

    title: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 14,
        lineHeight: 16,
        color: 'black',
    },

    counter: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 12,
        lineHeight: 14,
        color: Colors.gray,
    },
});