import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { getCorrectTimeDeclension } from '../../lib/utils';

interface IInitCountdown {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

interface IProps {
    startDate: string; // ISO format "YYYY-MM-DDTHH:MM:SS"
    endDate: string; // ISO format "YYYY-MM-DDTHH:MM:SS"
}

const CountdownTimer = ({ startDate, endDate }: IProps) => {
    const [timeLeft, setTimeLeft] = useState<IInitCountdown | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const fadeAnim = new Animated.Value(0); // for fade animation

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const start = new Date(startDate + 'T00:00:00');
            const end = new Date(endDate + 'T00:00:00');

            if (now < start || now > end) {
                setIsVisible(false);
                return;
            }

            const difference = end.getTime() - now.getTime();

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            });

            setIsVisible(true);
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);

        return () => clearInterval(timer);
    }, [startDate, endDate]);

    // Fade in animation
    useEffect(() => {
        if (isVisible && timeLeft) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isVisible, timeLeft]);

    if (!isVisible || !timeLeft) {
        return null;
    }

    return (
        <Animated.View
            style={[styles.container, { opacity: fadeAnim }]}
        >
            <Text style={styles.label}>До кінця пропозиції:</Text>
            <View style={styles.timeContainer}>
                {['days', 'hours', 'minutes', 'seconds'].map((unit, index) => (
                    <View key={unit} style={styles.timeUnit}>
                        <Animated.Text style={styles.timeValue}>
                            {timeLeft[unit as keyof IInitCountdown]}
                        </Animated.Text>
                        <Text style={styles.unitText}>
                            {index === 0
                                ? getCorrectTimeDeclension(timeLeft[unit as keyof IInitCountdown], 'дні')
                                : index === 1
                                    ? getCorrectTimeDeclension(timeLeft[unit as keyof IInitCountdown], 'години')
                                    : index === 2
                                        ? getCorrectTimeDeclension(timeLeft[unit as keyof IInitCountdown], 'хвилини')
                                        : 'секунди'}
                        </Text>
                    </View>
                ))}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
    },
    label: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333',
    },
    timeContainer: {
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
    },
    timeUnit: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    timeValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    unitText: {
        fontSize: 8,
        lineHeight: 10,
    },
});

export default CountdownTimer;
