import { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet } from "react-native";
import { Fonts } from "../../theme/fonts";

interface IProps {
    width: number;
    isVissible: boolean;
    isConnected: boolean;
}

function ConnectingBar({ width, isVissible, isConnected }: IProps) {
    const panelOpacity = useRef(new Animated.Value(0)).current;
    const imageOpacity = useRef(new Animated.Value(0)).current;
    const imageTranslateY = useRef(new Animated.Value(-40)).current;
    const imageRotate = useRef(new Animated.Value(0)).current;

    // Интерполяция для вращения
    const rotateInterpolate = imageRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    useEffect(() => {
        if (isVissible) {
            // Параллельные анимации для панели и изображения
            Animated.timing(panelOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            imageTranslateY.setValue(-40);
            imageOpacity.setValue(0);

            Animated.parallel([
                Animated.timing(imageOpacity, {
                    toValue: 1,
                    duration: 300,
                    delay: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(imageTranslateY, {
                    toValue: 0,
                    duration: 300,
                    delay: 500,
                    useNativeDriver: true,
                }),
            ]).start();

            // Бесконечное вращение с паузой
            const rotateWithPause = () => {
                imageRotate.setValue(0); // сбросим вращение

                Animated.sequence([
                    Animated.timing(imageRotate, {
                        toValue: 1,
                        duration: 3000, // продолжительность одного оборота
                        useNativeDriver: true,
                    }),
                    Animated.timing(imageRotate, {
                        toValue: 0,
                        duration: 0, // сразу сбрасываем
                        useNativeDriver: true,
                    }),
                    Animated.delay(3000), // пауза 3 секунды
                ]).start(() => {
                    // Повтор анимации
                    rotateWithPause();
                });
            };

            rotateWithPause(); // Запускаем цикл вращения
        }
    }, [isVissible]);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    width,
                    backgroundColor: isConnected ? "#08FFB830" : "#FC350910",
                    opacity: panelOpacity,
                },
            ]}
        >
            <Animated.Image
                source={
                    isConnected
                        ? require("../../assets/main-screen/green-circle.png")
                        : require("../../assets/main-screen/red-circle.png")
                }
                style={[
                    styles.image,
                    {
                        opacity: imageOpacity,
                        transform: [
                            { translateY: imageTranslateY },
                            { rotate: rotateInterpolate },
                        ],
                    },
                ]}
            />
            <Text
                style={[
                    styles.text,
                    { color: isConnected ? "#1EBF91" : "#FC3509" },
                ]}
            >
                {isConnected ? "Ви онлайн" : "Ви офлайн"}
            </Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 95,
        position: "absolute",
        top: 0,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        overflow: "hidden",
    },
    image: {
        width: 168,
        height: 168,
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
    },
    text: {
        fontSize: 16,
        fontFamily: Fonts.comfortaa600,
        textTransform: "uppercase",
        alignSelf: "center",
        position: "absolute",
        bottom: 8,
    },
});

export default ConnectingBar;
