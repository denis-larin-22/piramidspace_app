import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../theme/colors";
import { Fonts } from "../../../theme/fonts";
import { useState } from "react";

function NotificationItem({
    notification,
}: {
    notification: {
        title: string;
        notification: string;
        unread: boolean;
        date: string;
    };
}) {
    const {
        date,
        title,
        notification: notificationText,
        unread,
    } = notification;

    const [isOpen, setIsOpen] = useState(false);

    return (
        <Pressable onPress={() => setIsOpen(!isOpen)}>
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: unread ? Colors.blueUltraLight : Colors.pale,
                        minHeight: isOpen ? 100 : 'auto'
                    },
                ]}
            >
                <View style={{
                    height: '200%',
                    width: 4,
                    backgroundColor: unread ? Colors.blue : Colors.green,
                    opacity: unread ? 1 : 0.7,
                    position: 'absolute',
                    top: 0,
                    left: 0
                }}></View>

                <View
                    style={[
                        styles.iconWrapper,
                        {
                            backgroundColor: unread
                                ? Colors.blue
                                : Colors.green,
                        },
                    ]}
                >
                    <Image
                        source={require("../../../assets/main-screen/notification.png")}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>

                <Text style={styles.date}>{date}</Text>

                <View>
                    <Text style={styles.title}>{title}</Text>

                    <Text
                        numberOfLines={isOpen ? undefined : 1}
                        ellipsizeMode="tail"
                        style={[styles.notification, { color: isOpen ? 'black' : Colors.gray }]}
                    >
                        {notificationText}
                    </Text>
                    {!isOpen && <Image
                        source={require("../../../assets/main-screen/arrow-right-gray.png")}
                        style={styles.arrow}
                        resizeMode="contain"
                    />}
                </View>
            </View>
        </Pressable>
    );
}

export default NotificationItem;

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: Colors.grayLightBg,
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 7,
        overflow: 'hidden'
    },

    iconWrapper: {
        width: 30,
        height: 30,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },

    image: {
        width: 20,
        height: 20,
    },

    arrow: {
        width: 14,
        height: 14,
        position: 'absolute',
        bottom: 0,
        right: -15
    },

    date: {
        position: "absolute",
        top: 5,
        right: 5,
        fontFamily: Fonts.comfortaa400,
        fontSize: 11,
        lineHeight: 13,
        color: Colors.gray,
    },

    title: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 13,
        lineHeight: 15,
        color: 'black',
        marginBottom: 7,
    },

    notification: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 12,
        lineHeight: 14,
        maxWidth: 300,
    },
});