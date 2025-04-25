import { Image, Text, TouchableOpacity, View, StyleSheet, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";
import { Colors } from "../../theme/colors";
import { Fonts } from "../../theme/fonts";

function RateAndBalance() {
    const slideAnim1 = useRef(new Animated.Value(-20)).current;
    const fadeAnim1 = useRef(new Animated.Value(0)).current;

    const slideAnim2 = useRef(new Animated.Value(-20)).current;
    const fadeAnim2 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Анимация первой карточки
        Animated.parallel([
            Animated.timing(slideAnim1, {
                toValue: 0,
                duration: 500,
                delay: 500,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim1, {
                toValue: 1,
                duration: 500,
                delay: 500,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            })
        ]).start();

        // Анимация второй карточки с задержкой
        Animated.parallel([
            Animated.timing(slideAnim2, {
                toValue: 0,
                duration: 500,
                delay: 700,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim2, {
                toValue: 1,
                duration: 500,
                delay: 700,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={{
                transform: [{ translateY: slideAnim1 }],
                opacity: fadeAnim1,
                width: '48%',
            }}>
                <TouchableOpacity style={styles.card}>
                    <Image
                        source={require('../../assets/main-screen/rate.png')}
                        style={styles.rateIcon}
                        resizeMode="contain"
                    />
                    <View style={styles.textBlock}>
                        <Text style={styles.title}>Курс</Text>
                        <Text style={styles.subtitle}>42,32</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{
                transform: [{ translateY: slideAnim2 }],
                opacity: fadeAnim2,
                width: '48%',
            }}>
                <TouchableOpacity style={styles.card}>
                    <Image
                        source={require('../../assets/main-screen/balance.png')}
                        style={styles.balanceIcon}
                        resizeMode="contain"
                    />
                    <View style={styles.textBlock}>
                        <Text style={styles.title}>Баланс</Text>
                        <Text style={styles.subtitle}>545498</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        marginTop: 29,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        width: '100%',
        height: 95,
        backgroundColor: Colors.blue,
        borderRadius: 8,
        padding: 10,
        flexDirection: 'row',

        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        // Android shadow
        elevation: 5,
    },
    rateIcon: {
        width: 32,
        height: 28,
        position: 'absolute',
        top: 15,
        right: 15,
    },
    balanceIcon: {
        width: 29,
        height: 27,
        position: 'absolute',
        top: 15,
        right: 15,
    },
    textBlock: {
        alignSelf: 'flex-end',
    },
    title: {
        color: 'white',
        fontFamily: Fonts.comfortaa700,
        fontSize: 16,
    },
    subtitle: {
        color: 'white',
        fontFamily: Fonts.openSans400,
        fontSize: 14,
    },
});

export default RateAndBalance;
