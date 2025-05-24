import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Colors } from "../../theme/colors";
import { Fonts } from "../../theme/fonts";
import AnimatedWrapper from "../animation/AnimatedWrapper";
import AnimatedAbsolutePosition from "../animation/AnimatedTransition";
import { getBalanceByLogin, getExchangeDollarRate } from "../../lib/api";
import { getDataFromAcyncStorage } from "../../lib/async-storage/acyncStorage";
import { ASYNC_STORAGE_USER_LOGIN } from "../../lib/async-storage/asyncStorageKeys";

function RateAndBalance() {
    const [rateValue, setRateValue] = useState<null | string>(null);
    const [balanceValue, setBalanceValue] = useState<null | number>(null);

    useEffect(() => {
        setTimeout(() => {
            getRate();
            getBalance();
        }, 1000);
        // !!!!!!!!!!!!!!11
        // !!!!!!!!!!!!!!11
        // !!!!!!!!!!!!!!11
        // !!!!!!!!!!!!!!11
        // !!!!!!!!!!!!!!11
        // ПРОПИШИ СОХРАНЕНИЕ ЗНАЧЕНИЙ НА СЛУЧАЙ ЕСЛИ НЕТ ИНТЕРНЕТА, ВЫВОДИТЬ СТАРОЕ!!!!!!!!!
        // !!!!!!!!!!!!!!11
        // !!!!!!!!!!!!!!11
        // !!!!!!!!!!!!!!11
        // !!!!!!!!!!!!!!11


    }, []);

    async function getRate() {
        const value = await getExchangeDollarRate();
        setRateValue(value);
    }

    async function getBalance() {
        const userLoginValue = await getDataFromAcyncStorage(ASYNC_STORAGE_USER_LOGIN);
        const value = await getBalanceByLogin(userLoginValue as string);
        setBalanceValue(value);
    }

    return (
        <View style={styles.container}>
            <AnimatedWrapper
                style={{ width: '48%' }}
                offsetY={-40}
                useOpacity
                useScale
                duration={500}
                delay={500}
            >
                <TouchableOpacity style={styles.card}>
                    <AnimatedAbsolutePosition
                        right={rateValue ? 15 : 75}
                        top={rateValue ? 15 : 35}
                        style={styles.rateIcon}
                    >
                        <Image
                            source={require('../../assets/main-screen/rate.png')}
                            style={{
                                width: '100%',
                                height: '100%'
                            }}
                            resizeMode="contain"
                        />
                    </AnimatedAbsolutePosition>
                    {rateValue &&
                        <AnimatedWrapper
                            style={styles.textBlock}
                            offsetY={20}
                            duration={300}
                            useOpacity
                            useScale
                        >
                            <Text style={styles.title}>Курс</Text>
                            <Text style={styles.subtitle}>{rateValue}</Text>
                        </AnimatedWrapper>
                    }
                </TouchableOpacity>
            </AnimatedWrapper>

            <AnimatedWrapper
                style={{ width: '48%' }}
                offsetY={-40}
                useOpacity
                useScale
                duration={500}
                delay={700}
            >
                <TouchableOpacity style={styles.card}>
                    <AnimatedAbsolutePosition
                        right={balanceValue ? 15 : 75}
                        top={balanceValue ? 15 : 35}
                        style={styles.balanceIcon}
                    >
                        <Image
                            source={require('../../assets/main-screen/balance.png')}
                            style={{
                                width: '100%',
                                height: '100%'
                            }}
                            resizeMode="contain"
                        />
                    </AnimatedAbsolutePosition>
                    {balanceValue &&
                        <AnimatedWrapper
                            style={styles.textBlock}
                            offsetY={20}
                            duration={300}
                            useOpacity
                            useScale
                        >
                            <Text style={styles.title}>Баланс</Text>
                            <Text style={styles.subtitle}>{balanceValue}</Text>
                        </AnimatedWrapper>
                    }
                </TouchableOpacity>
            </AnimatedWrapper>
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
    },
    balanceIcon: {
        width: 29,
        height: 27,
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