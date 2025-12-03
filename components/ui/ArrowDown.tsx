import { Image, ImageStyle } from "react-native";
import AnimatedWrapper from "../animation/AnimatedWrapper";

export function ArrowDown({ style, isRotate = false }: { style?: ImageStyle, isRotate?: boolean }) {
    return (
        <>
            {isRotate ?
                <AnimatedWrapper
                    key="rotated"
                    useOpacity
                    offsetY={10}
                >
                    <Image
                        source={require("../../assets/catalog-screen/arrow.png")}
                        style={[
                            { width: 18, height: 11, resizeMode: "contain", top: -27, transform: [{ rotate: "180deg" }] },
                            style
                        ]}
                    />
                </AnimatedWrapper>
                :
                <AnimatedWrapper
                    key="notrotated"
                    useOpacity
                    offsetY={-10}
                >
                    <Image
                        source={require("../../assets/catalog-screen/arrow.png")}
                        style={[{ width: 18, height: 11, resizeMode: "contain", top: -25 }, style]}
                    />
                </AnimatedWrapper>
            }
        </>
    );
}

export default ArrowDown;