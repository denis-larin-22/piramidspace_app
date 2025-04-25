import React, { useEffect, useRef } from "react";
import { Animated, Image, Text, StyleSheet } from "react-native";
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

    useEffect(() => {
        if (isVissible) {
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
        } else {
            Animated.parallel([
                Animated.timing(imageOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(imageTranslateY, {
                    toValue: -40,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            setTimeout(() => {
                Animated.timing(panelOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            }, 500);
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
                        transform: [{ translateY: imageTranslateY }],
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
