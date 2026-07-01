import { Image, Modal, Pressable, StyleSheet, View } from "react-native";
import { Colors } from "../../../theme/colors";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { useState } from "react";
import { CloseButton } from "../../ui/CloseButton";
import NHeader from "./Header";
import NotificationsList from "./NotificationsList";

function NotificationsBell() {
    const [isOpen, setIsOpen] = useState(false);

    const notList = [
        {
            title: "Замовлення відправлено",
            notification: "Замовлення #123456 передано до нової пошти lorem dasdas asda sda sdafdfasd",
            unread: true,
            date: "28.06"
        },
        {
            title: "Замовлення в дорозі",
            notification: "Ваше замовлення #123457 вже прямує до відділення",
            unread: true,
            date: "27.06"
        },
        {
            title: "Замовлення обробляється",
            notification: "Замовлення #123458 готується до відправки",
            unread: false,
            date: "26.06"
        },
        {
            title: "Замовлення доставлено до міста",
            notification: "Посилка #123459 прибула до вашого міста",
            unread: true,
            date: "25.06"
        },
        {
            title: "Замовлення очікує отримання",
            notification: "Замовлення #123460 вже у відділенні та готове до видачі",
            unread: false,
            date: "24.06"
        },
        {
            title: "Замовлення успішно доставлено",
            notification: "Замовлення #123461 вручено отримувачу",
            unread: false,
            date: "23.06"
        },
        {
            title: "Замовлення відправлено",
            notification: "Замовлення #123456 передано до нової пошти lorem dasdas asda sda sdafdfasd",
            unread: false,
            date: "28.06"
        },
        {
            title: "Замовлення в дорозі",
            notification: "Ваше замовлення #123457 вже прямує до відділення",
            unread: false,
            date: "27.06"
        },
        {
            title: "Замовлення обробляється",
            notification: "Замовлення #123458 готується до відправки",
            unread: false,
            date: "26.06"
        },
        {
            title: "Замовлення доставлено до міста",
            notification: "Посилка #123459 прибула до вашого міста",
            unread: false,
            date: "25.06"
        },
        {
            title: "Замовлення очікує отримання",
            notification: "Замовлення #123460 вже у відділенні та готове до видачі",
            unread: false,
            date: "24.06"
        },
        {
            title: "Замовлення успішно доставлено",
            notification: "Замовлення #123461 вручено отримувачу",
            unread: false,
            date: "23.06"
        },
        {
            title: "Замовлення відправлено",
            notification: "Замовлення #123456 передано до нової пошти lorem dasdas asda sda sdafdfasd",
            unread: false,
            date: "28.06"
        },
        {
            title: "Замовлення в дорозі",
            notification: "Ваше замовлення #123457 вже прямує до відділення",
            unread: false,
            date: "27.06"
        },
        {
            title: "Замовлення обробляється",
            notification: "Замовлення #123458 готується до відправки",
            unread: false,
            date: "26.06"
        },
        {
            title: "Замовлення доставлено до міста",
            notification: "Посилка #123459 прибула до вашого міста",
            unread: false,
            date: "25.06"
        },
        {
            title: "Замовлення очікує отримання",
            notification: "Замовлення #123460 вже у відділенні та готове до видачі",
            unread: false,
            date: "24.06"
        },
        {
            title: "Замовлення успішно доставлено",
            notification: "Замовлення #123461 вручено отримувачу",
            unread: false,
            date: "23.06"
        }
    ];

    const unreadCount = notList.filter((not) => not.unread).length;

    return (
        <>
            <Pressable
                style={styles.bellWrapper}
                onPress={() => setIsOpen(true)}
            >
                <View style={styles.bellDot} />
                <Image
                    source={require("../../../assets/main-screen/bell.png")}
                    style={styles.bellImage}
                    resizeMode="contain"
                />
            </Pressable>

            <Modal
                visible={isOpen}
                transparent={true}
                animationType="fade"
                statusBarTranslucent={true}
                onRequestClose={() => { }}
            >
                <AnimatedWrapper
                    style={styles.modalOverlay}
                    useOpacity
                    duration={200}
                >
                    <AnimatedWrapper
                        useOpacity
                        offsetY={-150}
                        delay={100}
                        duration={400}
                        style={styles.modalContent}
                    >
                        <NHeader
                            unreadNotificationsCount={unreadCount}
                        />

                        <NotificationsList notificationList={notList} unreadCount={unreadCount} />
                    </AnimatedWrapper>
                    <CloseButton
                        style={{
                            position: 'absolute',
                            bottom: -75,
                            right: 20,
                        }}
                        closeHandler={() => setIsOpen(false)}
                    />
                </AnimatedWrapper>
            </Modal>
        </>
    )
};

export default NotificationsBell;

const styles = StyleSheet.create({
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
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
        padding: 0,
        margin: 0,
        position: 'relative',
    },
    modalContent: {
        backgroundColor: 'white',
        paddingVertical: 20,
        paddingHorizontal: 12,
        paddingTop: 70,
        borderRadius: 13,
        height: '65%',
        position: 'relative',
        overflow: 'hidden',
    },

});
