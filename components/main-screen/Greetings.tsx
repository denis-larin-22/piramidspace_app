import { Image, Text, View, StyleSheet, Animated, Easing } from "react-native";
import { Fonts } from "../../theme/fonts";
import { getGreetingUA } from "../../lib/utils";
import { Colors } from "../../theme/colors";
import { useEffect, useRef } from "react";

function Greetings({ userName, isOnline = false }: { userName: string, isOnline?: boolean }) {
    const greetingValue = getGreetingUA();

    // 🔸 Анимационные значения
    const slideAnim = useRef(new Animated.Value(-50)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // 🔸 Запуск двух анимаций одновременно
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                delay: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY: slideAnim }],
                    opacity: fadeAnim,
                }
            ]}
        >
            <Text style={styles.greetingText}>
                {greetingValue},
                <Text style={styles.userName}> {userName}!</Text>
            </Text>
            <View style={styles.avatarWrapper}>
                <View style={[
                    styles.statusIndicator,
                    { backgroundColor: isOnline ? Colors.green : Colors.red }
                ]} />
                <Image
                    source={require('../../assets/main-screen/avatar.png')}
                    style={styles.avatarImage}
                    resizeMode="contain"
                />
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    greetingText: {
        fontSize: 20,
        fontFamily: Fonts.comfortaa400,
    },
    userName: {
        fontFamily: Fonts.comfortaa700,
    },
    avatarWrapper: {
        width: 31,
        height: 31,
        borderRadius: 100,
        position: 'relative',
    },
    statusIndicator: {
        width: 11,
        height: 11,
        borderWidth: 1,
        borderColor: Colors.pale,
        borderRadius: 100,
        position: 'absolute',
        zIndex: 10,
        right: -2,
        top: -4,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
});

export default Greetings;
