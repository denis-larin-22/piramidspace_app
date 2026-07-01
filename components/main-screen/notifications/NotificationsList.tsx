import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../theme/colors";
import { useEffect, useRef, useState } from "react";
import { Fonts } from "../../../theme/fonts";
import NotificationItem from "./NotificationItem";
import AnimatedWrapper from "../../animation/AnimatedWrapper";

function NotificationsList({
    notificationList,
    unreadCount,
}: {
    unreadCount: number;
    notificationList: {
        title: string;
        notification: string;
        unread: boolean;
        date: string;
    }[];
}) {
    const [listSwitch, setListSwitch] = useState<"all" | "unread">("all");

    const scrollRef = useRef<ScrollView>(null);

    // 👉 при смене вкладки скроллим вверх
    useEffect(() => {
        scrollRef.current?.scrollTo({
            y: 0,
            animated: true,
        });
    }, [listSwitch]);

    return (
        <View>
            {/* TABS */}
            <View style={styles.tabs}>
                <Pressable
                    onPress={() => setListSwitch("all")}
                    style={[
                        styles.tab,
                        {
                            backgroundColor:
                                listSwitch === "all" ? "white" : Colors.pale,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.tabText,
                            {
                                color:
                                    listSwitch === "all"
                                        ? Colors.blue
                                        : Colors.gray,
                            },
                        ]}
                    >
                        Усі
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => setListSwitch("unread")}
                    style={[
                        styles.tab,
                        {
                            backgroundColor:
                                listSwitch === "unread"
                                    ? "white"
                                    : Colors.pale,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.tabText,
                            {
                                color:
                                    listSwitch === "unread"
                                        ? Colors.blue
                                        : Colors.gray,
                            },
                        ]}
                    >
                        Непрочитані
                    </Text>
                </Pressable>
            </View>

            <View style={styles.divider} />

            {/* LIST */}
            <ScrollView
                ref={scrollRef}
                style={styles.list}
                nestedScrollEnabled
                showsVerticalScrollIndicator={true}
            >
                <AnimatedWrapper key={listSwitch} offsetX={30}>
                    <>
                        {listSwitch === "unread" && (
                            <>
                                {unreadCount === 0 ? (
                                    <Text style={styles.emptyText}>
                                        Немає нових повідомлень
                                    </Text>
                                ) : (
                                    <View style={styles.newSection}>
                                        <Text style={styles.sectionTitle}>
                                            Нові
                                        </Text>

                                        {notificationList
                                            .filter((n) => n.unread)
                                            .map((notification, index) => (
                                                <NotificationItem
                                                    key={index}
                                                    notification={notification}
                                                />
                                            ))}
                                    </View>
                                )}
                            </>
                        )}

                        {listSwitch === "all" && (
                            <>
                                {unreadCount !== 0 && (
                                    <View style={styles.newSection}>
                                        <Text style={styles.sectionTitle}>
                                            Нові
                                        </Text>

                                        {notificationList
                                            .filter((n) => n.unread)
                                            .map((notification, index) => (
                                                <NotificationItem
                                                    key={index}
                                                    notification={notification}
                                                />
                                            ))}
                                    </View>
                                )}

                                <View style={styles.oldSection}>
                                    <Text style={styles.sectionTitleOld}>
                                        Раніше
                                    </Text>

                                    {notificationList
                                        .filter((n) => !n.unread)
                                        .map((notification, index) => (
                                            <NotificationItem
                                                key={index}
                                                notification={notification}
                                            />
                                        ))}
                                </View>
                            </>
                        )}
                    </>
                </AnimatedWrapper>
            </ScrollView>
        </View>
    );
}

export default NotificationsList;

const styles = StyleSheet.create({
    tabs: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 5,
        backgroundColor: Colors.pale,
        padding: 5,
        borderRadius: 12,
        marginTop: 5,
    },

    tab: {
        width: "40%",
        paddingVertical: 7,
        borderRadius: 9,
    },

    tabText: {
        textAlign: "center",
        fontFamily: Fonts.comfortaa700,
        fontSize: 13,
        lineHeight: 15,
    },

    divider: {
        width: "100%",
        height: 1,
        backgroundColor: Colors.grayLight,
    },

    list: {
        maxHeight: '85%',
        flexGrow: 1,
        padding: 5,
        paddingBottom: 10,
        borderRadius: 12,
    },

    newSection: {
        marginTop: 10,
        gap: 7,
        marginBottom: 10,
    },

    oldSection: {
        marginTop: 10,
        gap: 7,
        paddingBottom: 10,
        marginBottom: 10,
    },

    sectionTitle: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 14,
        lineHeight: 16,
        color: "black",
        marginLeft: 15,
        paddingBottom: 10,
    },

    sectionTitleOld: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 14,
        lineHeight: 16,
        color: "black",
        marginLeft: 15,
    },

    emptyText: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 13,
        lineHeight: 15,
        color: Colors.gray,
        alignSelf: "center",
        marginTop: 60,
    },
});