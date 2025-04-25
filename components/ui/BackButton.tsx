import { Image, Text, TouchableOpacity } from "react-native"
import { Fonts } from "../../theme/fonts"
import { Colors } from "../../theme/colors"

interface IProps {
    text: string,
    onPressAction: () => void,
}

function BackButton({ text, onPressAction }: IProps) {
    return (
        <TouchableOpacity
            style={{
                paddingBottom: 4,
                paddingRight: 16,
                paddingLeft: 8,
                borderRadius: 23,
                backgroundColor: Colors.blue,
                flexDirection: 'row',
                alignItems: "center",
                gap: 10,
                // iOS shadow
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,

                // Android shadow
                elevation: 5,
            }}
            onPress={onPressAction}
        >
            <Image
                source={require('../../assets/arrow-back.png')}
                style={{
                    width: 12,
                    height: 12,
                    resizeMode: "contain",
                    position: "relative",
                    top: 1,
                }}
            />
            <Text
                style={{
                    color: "white",
                    fontFamily: Fonts.comfortaa700,
                    fontSize: 12,
                }}
            >
                {text}
            </Text>
        </TouchableOpacity>
    )
};

export default BackButton;