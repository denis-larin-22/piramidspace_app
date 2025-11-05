import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../theme/colors";
import { Fonts } from "../../theme/fonts";
import AnimatedWrapper from "../animation/AnimatedWrapper";

function ErrorNotification({ message }: { message: string }) {
    return (
        <View style={styles.modalWrap}>
            <AnimatedWrapper
                offsetY={50}
                duration={500}
                useOpacity
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
        backgroundColor: Colors.pale,
        alignItems: "center",
        justifyContent: "flex-start",
        borderRadius: 14,
        overflow: 'hidden',
        paddingBottom: 20,
        paddingTop: 50,
        paddingHorizontal: 6
    },
    headText: {
        width: 250,
        textAlign: 'center',
        fontFamily: Fonts.comfortaa600,
        fontSize: 16,
        color: 'white',
        backgroundColor: '#FF0A0A90',
        paddingVertical: 8,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    messageText: {
        fontSize: 14,
        textAlign: 'center',
        color: 'black'
    },
});

