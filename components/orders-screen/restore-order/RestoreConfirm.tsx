import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native"
import AnimatedWrapper from "../../animation/AnimatedWrapper"
import { Colors } from "../../../theme/colors";
import { Fonts } from "../../../theme/fonts";

function RestoreConfirm({ isOpen, confirmHandler, rejectHandler }: {
    isOpen: boolean | null,
    confirmHandler: () => void,
    rejectHandler: () => void
}) {
    return (
        <Modal visible={isOpen === null} transparent>
            <AnimatedWrapper
                style={styles.modalOverlay}
                useOpacity
                duration={200}
            >
                <AnimatedWrapper
                    useOpacity
                    useScale
                    offsetY={100}
                    delay={100}
                    duration={200}
                    style={styles.modalConfirm}
                >
                    <Image
                        source={require("../../../assets/orders-screen/warning.png")}
                        style={styles.warningIcon}
                        resizeMode="contain"
                    />
                    <Text style={styles.modalTitle}>Бажаєте відновити замовлення?</Text>

                    <View style={styles.modalButtons}>
                        <Pressable
                            style={styles.confirmButton}
                            onPress={confirmHandler}
                        >
                            <Text style={styles.confirmButtonText}>Так</Text>
                        </Pressable>
                        <Pressable
                            style={styles.cancelButton}
                            onPress={rejectHandler}
                        >
                            <Text style={styles.cancelButtonText}>Ні</Text>
                        </Pressable>
                    </View>
                </AnimatedWrapper>
            </AnimatedWrapper>
        </Modal>
    )
}

export default RestoreConfirm;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
    },
    modalConfirm: {
        backgroundColor: 'white',
        paddingVertical: 20,
        paddingHorizontal: 12,
        borderRadius: 13,
        width: '80%',
        alignItems: 'center',
        maxHeight: 300,
    },
    warningIcon: {
        width: 50,
        height: 50,
        marginBottom: 10
    },
    modalTitle: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 18,
        color: 'black',
        marginBottom: 20,
        textAlign: 'center'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20
    },
    cancelButton: {
        width: 70,
        padding: 10,
        borderWidth: 1,
        borderColor: '#A2A2A870',
        borderRadius: 14,
    },
    cancelButtonText: {
        fontFamily: Fonts.openSans400,
        color: Colors.gray,
        textAlign: 'center'
    },
    confirmButton: {
        width: 70,
        padding: 10,
        borderRadius: 14,
        backgroundColor: Colors.blue
    },
    confirmButtonText: {
        fontFamily: Fonts.openSans400,
        color: 'white',
        textAlign: 'center'
    },
});