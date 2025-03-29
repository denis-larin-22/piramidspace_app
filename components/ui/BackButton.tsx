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
                gap: 10
            }}
            onPress={onPressAction}
        >
            <Image
                source={require('../../assets/arrow-back.png')}
                style={{
                    width: 16,
                    height: 16,
                    resizeMode: "contain",
                    position: "relative",
                    top: 2
                }}
            />
            <Text
                style={{
                    color: "white",
                    fontFamily: Fonts.comfortaa700,
                    fontSize: 14,
                }}
            >
                {text}
            </Text>
        </TouchableOpacity>
    )
};

export default BackButton;