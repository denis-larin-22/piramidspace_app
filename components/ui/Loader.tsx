import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../theme/colors";

function Loader() {
    return (
        <View style={styles.container}>
            <View
                style={styles.wrap}
            >
                <ActivityIndicator
                    color={Colors.blue}
                    size={"large"}
                />
                <Text style={styles.text}>
                    👤 Вхід в кабінет
                </Text>
            </View>
        </View>
    )
};

export default Loader;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#00000080",
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    wrap: {
        width: 250,
        height: 100,
        backgroundColor: Colors.pale,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        borderRadius: 14,
        borderTopWidth: 3,
        borderColor: Colors.blue,

    },
    text: {
        fontSize: 14,
        fontWeight: 500
    },
})

// import { View, Animated, Easing } from "react-native";
// import { useEffect, useState } from "react";
// import Svg, { Path } from "react-native-svg";

// export default function Loader() {
//     return (
//         <View style={{ flexDirection: "row", alignItems: "center", position: "relative" }}>
//             {/* Vanishing Circle */}
//             <LoaderCircle rotationAnimation={true} style={{ position: "absolute", top: 0, left: 0 }} opacityAnimation={true} fill="#2B2548" />

//             {/* Left Circle */}
//             <LoaderCircle rotationAnimation={true} fill="#3372F9" />

//             {/* Right Circle */}
//             <LoaderCircle rotationAnimation={true} opacityAnimation={true} fill="#2B2548" />
//         </View>
//     );
// }

// interface LoaderCircleProps {
//     fill?: string;
//     rotationAnimation?: boolean; // Необязательный пропс
//     opacityAnimation?: boolean;
//     style?: object; // Можно уточнить тип, например, с использованием ViewStyle для React Native
// }

// function LoaderCircle({ fill, rotationAnimation, opacityAnimation, style }: LoaderCircleProps) {
//     const [rotateValue] = useState(new Animated.Value(0));
//     const [opacityValue] = useState(new Animated.Value(opacityAnimation ? 0 : 1));

//     useEffect(() => {
//         if (rotationAnimation) {
//             Animated.loop(
//                 Animated.timing(rotateValue, {
//                     toValue: 1,
//                     duration: 2000,
//                     easing: Easing.linear,
//                     useNativeDriver: true,
//                 })
//             ).start();
//         }

//         if (opacityAnimation) {
//             Animated.loop(
//                 Animated.sequence([
//                     Animated.timing(opacityValue, { toValue: 1, duration: 500, useNativeDriver: true }),
//                     Animated.timing(opacityValue, { toValue: 0, duration: 500, useNativeDriver: true }),
//                 ])
//             ).start();
//         }
//     }, []);

//     const rotateInterpolate = rotateValue.interpolate({
//         inputRange: [0, 1],
//         outputRange: ["0deg", "360deg"],
//     });

//     return (
//         <Animated.View style={[{ transform: [{ rotate: rotateInterpolate }], opacity: opacityValue }, style]}>
//             <Svg width={35} height={35} viewBox="0 0 35 35" fill="none">
//                 <Path
//                     fillRule="evenodd"
//                     clipRule="evenodd"
//                     d="M33.9389 19.3156C35.1723 10.0081 28.6268 1.4638 19.3192 0.231314C10.0116 -1.00117 1.4665 5.54491 0.233163 14.8524C-1.00018 24.1599 5.5453 32.7042 14.8529 33.9367C24.1605 35.1692 32.7056 28.6231 33.9389 19.3156Z"
//                     fill={fill}
//                 />
//             </Svg>
//         </Animated.View>
//     );
// }
