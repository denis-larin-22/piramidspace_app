import { Image, StyleSheet, Text, View, ViewStyle } from "react-native";
import AnimatedWrapper from "../animation/AnimatedWrapper";
import { Fonts } from "../../theme/fonts";
import { Colors } from "../../theme/colors";

export function ErrorMessage({ errorText, styles }: { errorText: string, styles?: ViewStyle }) {
    return (
        <AnimatedWrapper style={[style.errorMessage, styles]} useOpacity offsetY={20}>
            <View style={style.iconWrap}>
                <Image
                    source={require('../../assets/orders-screen/error.webp')}
                    style={style.icon}
                />
            </View>
            <View>
                <Text style={style.errorTitle}>Помилка!</Text>
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
        alignSelf: "center",
        backgroundColor: "#FF6B6B",
        padding: 10,
        borderRadius: 16,
        alignItems: 'center',
        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        // Android shadow
        elevation: 5,
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
        textAlign: 'center',
        color: 'white'
    },
    errorMessageText: {
        fontFamily: Fonts.openSans400,
        fontSize: 13,
        lineHeight: 18,
        color: 'white',
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