import { Fragment } from "react";
import AnimatedWrapper from "../animation/AnimatedWrapper";
import { Colors } from "../../theme/colors";
import { Text } from "react-native";
import { Fonts } from "../../theme/fonts";

function Warning({ isVissible, text }: { isVissible: boolean, text: number | undefined }) {
    if (text === undefined) return null;

    return (
        <Fragment>
            {isVissible &&
                <AnimatedWrapper
                    useOpacity
                    offsetY={20}
                    style={{
                        position: 'absolute',
                        zIndex: 100,
                        backgroundColor: 'white',
                        borderRadius: 13,
                        paddingVertical: 3,
                        paddingHorizontal: 10,
                        width: 110,
                        borderLeftWidth: 15,
                        borderLeftColor: Colors.red,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        elevation: 5,
                    }}
                >
                    <Text style={{ fontFamily: Fonts.openSans400, color: Colors.gray }}>
                        max: {text}
                    </Text>
                </AnimatedWrapper>}
        </Fragment>
    )
}

export default Warning;