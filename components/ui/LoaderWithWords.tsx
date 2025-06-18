import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import Loader from './Loader'
import AnimatedWrapper from '../animation/AnimatedWrapper';
import { Fonts } from '../../theme/fonts';
import { Colors } from '../../theme/colors';

const phrases = [
    'Завантажуємо дані',
    'Все буде готово за мить',
    'Вже майже все',
    'Дякуємо за очікування',
    'Залишилося зовсім трохи',
    'Система думає 😊',
];

function LoaderWithWords({ radius }: { radius?: number }) {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % phrases.length)
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    return (
        <View style={styles.container}>
            <Loader radius={radius} />
            {phrases.map((phrase, indexWord) => {
                if (index === indexWord) {
                    return (
                        <AnimatedWrapper
                            key={index}
                            useOpacity
                            offsetX={-50}
                            duration={300}
                        >
                            <Text style={styles.text}>{phrase}</Text>
                        </AnimatedWrapper>
                    )
                }
            })}
        </View>
    )
};

export default LoaderWithWords

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 14,
        fontFamily: Fonts.comfortaa700,
        color: Colors.gray,
        textAlign: 'center',

    },
})
