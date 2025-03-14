import { Modal, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../theme/colors";

function ErrorNotification({ isVissible, message }: { isVissible: boolean, message: string }) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVissible}
        >
            <View style={styles.modalWrap}>
                <View style={styles.modalTextWrap}>
                    <Text style={styles.headText}>😔 Щось пішло не так...</Text>
                    <Text style={styles.messageText}>{message}</Text>
                </View>
            </View>
        </Modal>
    )
};

export default ErrorNotification;

const styles = StyleSheet.create({
    modalWrap: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00000098",
    },
    modalTextWrap: {
        width: 250,
        height: 100,
        backgroundColor: Colors.pale,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        borderRadius: 14,
        borderTopWidth: 3,
        borderColor: Colors.red,
    },
    headText: {
        fontSize: 14,
        fontWeight: 500,
        textAlign: "center",
    },
    messageText: {
        fontSize: 12,
    },
})
