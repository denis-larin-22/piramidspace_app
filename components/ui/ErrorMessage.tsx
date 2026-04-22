import { Image, StyleSheet, Text, View, ViewStyle } from "react-native";
import AnimatedWrapper from "../animation/AnimatedWrapper";
import { Fonts } from "../../theme/fonts";
import { Colors } from "../../theme/colors";
import { shadow } from "../../theme/shadow";

export function ErrorMessage({ errorTitle = "Помилка", errorText, styles }: { errorTitle?: string, errorText: string, styles?: ViewStyle }) {
    return (
        <AnimatedWrapper style={[style.errorMessage, shadow, styles]} useOpacity offsetY={20}>
            <View style={style.iconWrap}>
                <Image
                    source={require('../../assets/orders-screen/error.webp')}
                    style={style.icon}
                />
            </View>
            <View>
                <Text style={style.errorTitle}>{errorTitle}</Text>
                <Text style={style.errorMessageText}>{errorText}</Text>
            </View>
        </AnimatedWrapper>
    );
}

const style = StyleSheet.create({
    errorMessage: {
        overflow: 'hidden',
        position: "absolute",
        top: 20,
        zIndex: 100,
        alignSelf: "center",
        backgroundColor: "#FF6B6B",
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
    },
    iconWrap: {
        width: 25,
        height: 25,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
    },
    icon: {
        width: '105%',
        height: '105%',
        resizeMode: 'contain',
    },
    errorTitle: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 16,
        marginBottom: 5,
        marginTop: 10,
        textAlign: 'center',
        color: 'white'
    },
    errorMessageText: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 13,
        lineHeight: 18,
        color: 'white',
        textAlign: 'center'
    },
    errorMarker: {
        width: 22,
        height: '500%',
        backgroundColor: Colors.red,
        position: 'absolute',
        top: 0,
        left: 0
    },
});