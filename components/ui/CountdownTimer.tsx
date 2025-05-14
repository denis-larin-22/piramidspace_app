import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getCorrectTimeDeclension } from '../../lib/utils';
import { Fonts } from '../../theme/fonts';

interface IInitCountdown {
    days: number;
    hours: number;
    minutes: number;
}

interface IProps {
    startDate: string; // ISO format "YYYY-MM-DD"
    endDate: string;   // ISO format "YYYY-MM-DD"
}

const CountdownTimer = ({ startDate, endDate }: IProps) => {
    const [timeLeft, setTimeLeft] = useState<IInitCountdown>({
        days: 0,
        hours: 0,
        minutes: 0,
    });

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const end = new Date(endDate + 'T00:00:00');

            const difference = end.getTime() - now.getTime();

            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
            });
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 60 * 1000);

        return () => clearInterval(timer);
    }, [endDate]);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>До кінця пропозиції:</Text>
            <View style={styles.timeContainer}>
                {(['days', 'hours', 'minutes'] as const).map((unit) => (
                    <View key={unit} style={styles.timeUnit}>
                        <Text style={styles.timeValue}>{timeLeft[unit]}</Text>
                        <Text style={styles.unitText}>
                            {getCorrectTimeDeclension(
                                timeLeft[unit],
                                unit === 'days' ? 'дні' :
                                    unit === 'hours' ? 'години' : 'хвилини'
                            )}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '90%',
        padding: 2,
        alignSelf: 'center',
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
    },
    label: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#33333385',
        fontFamily: Fonts.openSans400
    },
    timeContainer: {
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
    },
    timeUnit: {
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 40,
    },
    timeValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333333',
        fontFamily: Fonts.comfortaa400
    },
    unitText: {
        fontSize: 8,
        lineHeight: 10,
        color: '#33333395',
        fontFamily: Fonts.openSans400
    },
});

export default CountdownTimer;
