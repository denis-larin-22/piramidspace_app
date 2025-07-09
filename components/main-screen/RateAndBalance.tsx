import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Colors } from "../../theme/colors";
import { Fonts } from "../../theme/fonts";
import AnimatedWrapper from "../animation/AnimatedWrapper";
import AnimatedAbsolutePosition from "../animation/AnimatedTransition";
import { useNetworkStatus } from "../../lib/hooks/useNetworkStatus";
import { useBalanceValue } from "../../lib/hooks/useBalanceValue";
import { useDollarRate } from "../../lib/hooks/useDollarRate";

function RateAndBalance() {
    const { isConnected } = useNetworkStatus();

    const { balance, isLoading: isBalanceLoading } = useBalanceValue(isConnected);
    const { rate, isLoading: isRateLoading } = useDollarRate(isConnected);

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
                <View style={styles.card}>
                    <AnimatedAbsolutePosition
                        right={rate ? 15 : 75}
                        top={rate ? 15 : 35}
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
                    {!isRateLoading &&
                        <AnimatedWrapper
                            style={styles.textBlock}
                            offsetY={20}
                            duration={300}
                            useOpacity
                            useScale
                        >
                            <Text style={styles.title}>Курс</Text>
                            <Text style={styles.subtitle}>{rate}</Text>
                        </AnimatedWrapper>
                    }
                </View>
            </AnimatedWrapper>

            <AnimatedWrapper
                style={{ width: '48%' }}
                offsetY={-40}
                useOpacity
                useScale
                duration={500}
                delay={700}
            >
                <View style={styles.card}>
                    <AnimatedAbsolutePosition
                        right={balance ? 15 : 75}
                        top={balance ? 15 : 35}
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
                    {!isBalanceLoading &&
                        <AnimatedWrapper
                            style={styles.textBlock}
                            offsetY={20}
                            duration={300}
                            useOpacity
                            useScale
                        >
                            <Text style={styles.title}>Баланс</Text>
                            <Text style={styles.subtitle}>{balance}</Text>
                        </AnimatedWrapper>
                    }
                </View>
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
        fontSize: 17,
    },
    subtitle: {
        color: 'white',
        fontFamily: Fonts.openSans400,
        fontSize: 15,
        marginTop: 4
    },
});

export default RateAndBalance;