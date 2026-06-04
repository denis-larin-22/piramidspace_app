import { Text, View, Animated, ViewStyle, StyleProp } from "react-native";
import { Colors } from "../../../../theme/colors";
import { Fonts } from "../../../../theme/fonts";

function RetailOrderButton({ style }: { style?: StyleProp<ViewStyle> }) {
    return (
        <View
            style={[{
                width: 200,
                height: 40,
                borderRadius: 12,
                paddingHorizontal: 6,
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: Colors.blueLight,
            }, style]}
        >
            {/* checkbox */}
            <View
                style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: Colors.blue,
                }}
            >
                {/* checkmark */}
                <Animated.Image
                    source={require('../../../../assets/orders-screen/done.png')}
                    style={{
                        width: 18,
                        height: 18,
                        borderRadius: 50,
                    }}
                />
            </View>

            {/* text */}
            <View>
                <Text
                    style={{
                        fontFamily: Fonts.comfortaa700,
                        fontSize: 11,
                        lineHeight: 13,
                        color: Colors.blue,
                        letterSpacing: 0.2,
                    }}
                >
                    ЗАМОВЛЕННЯ В РОЗДРІБ
                </Text>
                <Text
                    style={{
                        fontFamily: Fonts.openSans400,
                        fontSize: 10,
                        lineHeight: 12,
                        color: Colors.blue,
                        letterSpacing: 0.2,
                    }}
                >
                    режим роздрібу
                </Text>
            </View>
        </View>
    );
}

export default RetailOrderButton;