import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { fetchDeleteOrder } from "../../../lib/api/orders-screen/ordersList";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";

function DeleteOrderButton({
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    idOrder,
    loginValue,
    triggerRefetch
}: {
    isDeleteModalOpen: boolean,
    setIsDeleteModalOpen: (value: boolean) => void,
    idOrder: number,
    loginValue: string | undefined,
    triggerRefetch: () => void
}) {
    return (
        <>
            <Pressable
                style={styles.deleteBtn}
                onPress={() => setIsDeleteModalOpen(true)}
            >
                <Image
                    source={require("../../../assets/orders-screen/delete.webp")}
                    style={styles.deleteIcon}
                    resizeMode="contain"
                />
            </Pressable>

            <Modal visible={isDeleteModalOpen} transparent>
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
                        style={styles.modalContent}
                    >
                        <Image
                            source={require("../../../assets/orders-screen/warning.png")}
                            style={styles.warningIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.modalTitle}>Видалити замовлення?</Text>
                        <Text style={styles.modalSubtitle}>Видалення замовлення №{idOrder}</Text>

                        <View style={styles.modalButtons}>
                            <Pressable
                                style={styles.cancelButton}
                                onPress={() => setIsDeleteModalOpen(false)}
                            >
                                <Text style={styles.cancelButtonText}>Відмінити</Text>
                            </Pressable>
                            <Pressable
                                style={styles.deleteConfirmButton}
                                onPress={async () => {
                                    if (!loginValue) return;

                                    const result = await fetchDeleteOrder({
                                        login: loginValue,
                                        order_N: idOrder.toString(),
                                        userType: 'менеджер'
                                    });

                                    triggerRefetch();
                                    setIsDeleteModalOpen(false);
                                }}
                            >
                                <Text style={styles.deleteConfirmButtonText}>Видалити</Text>
                            </Pressable>
                        </View>
                    </AnimatedWrapper>
                </AnimatedWrapper>
            </Modal>
        </>
    )
};

export default DeleteOrderButton;

const styles = StyleSheet.create({
    deleteBtn: {
        width: 40,
        height: 40,
        backgroundColor: Colors.pale,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    },
    deleteIcon: {
        width: 20,
        height: 20,
        opacity: 0.3
    },
    modalOverlay: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        position: "relative",
        height: "100%",
        width: "100%",
        backgroundColor: "#00000080",
    },
    modalContent: {
        backgroundColor: Colors.pale,
        paddingVertical: 20,
        paddingHorizontal: 12,
        borderRadius: 13,
        width: '100%',
        position: 'relative',
        top: '-5%',
        alignItems: 'center'
    },
    warningIcon: {
        width: 50,
        height: 50,
        marginBottom: 20
    },
    modalTitle: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 18,
        color: 'black',
        marginBottom: 5
    },
    modalSubtitle: {
        fontFamily: Fonts.openSans400,
        fontSize: 14,
        marginBottom: 30,
        color: Colors.gray
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20
    },
    cancelButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#A2A2A870',
        borderRadius: 14,
    },
    cancelButtonText: {
        fontFamily: Fonts.openSans400,
        color: Colors.gray
    },
    deleteConfirmButton: {
        padding: 10,
        borderRadius: 14,
        backgroundColor: Colors.blue
    },
    deleteConfirmButtonText: {
        fontFamily: Fonts.openSans400,
        color: 'white'
    },
});