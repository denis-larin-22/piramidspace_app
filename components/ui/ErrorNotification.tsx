import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../theme/colors";
import { Fonts } from "../../theme/fonts";
import AnimatedWrapper from "../animation/AnimatedWrapper";

function ErrorNotification({ message }: { message: string }) {
    return (
        <View style={styles.modalWrap}>
            <AnimatedWrapper
                offsetY={-50}
                useOpacity
                useScale
                style={styles.modalTextWrap}
            >
                <Text style={styles.headText}>😔 Щось пішло не так...</Text>
                <Text style={styles.messageText}>{message}</Text>
            </AnimatedWrapper>
        </View>
    )
};

export default ErrorNotification;

const styles = StyleSheet.create({
    modalWrap: {
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
    modalTextWrap: {
        width: 250,
        height: 100,
        backgroundColor: Colors.pale,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 14,
        overflow: 'hidden'
    },
    headText: {
        width: '100%',
        textAlign: 'center',
        fontFamily: Fonts.comfortaa600,
        fontSize: 16,
        paddingBottom: 5,
        color: 'white',
        backgroundColor: '#FF0A0A90',
        paddingTop: 5,
        position: 'relative',
        top: -16
    },
    messageText: {
        maxWidth: '80%',
        fontSize: 14,
        textAlign: 'center'
    },
})
