import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { fetchDeleteOrder } from "../../../lib/api/orders-screen/ordersList";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";
import { SuccessMessage } from "../../ui/SuccessMessage";
import { ErrorMessage } from "../../ui/ErrorMessage";
import { useState } from "react";

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
    const initDeletingResult: {
        isVissible: null | 'success' | 'error',
        title: string,
        text: string
    } = {
        isVissible: null,
        title: "",
        text: ""
    }

    const [deletingResult, setDeletingResult] = useState(initDeletingResult);

    async function deleteHandler() {
        if (!loginValue) return;

        const result = await fetchDeleteOrder({
            login: loginValue,
            order_N: idOrder.toString(),
            userType: 'manager'
        });

        if (result === null) {
            setDeletingResult({
                isVissible: "error",
                title: "Помилка видалення",
                text: `Помилка видалення замовлення №${idOrder}`
            });

            setTimeout(() => {
                setDeletingResult(initDeletingResult);
                setIsDeleteModalOpen(false);
            }, 2500);
        } else {
            setDeletingResult({
                isVissible: "success",
                title: "Видалено",
                text: `Замовлення №${idOrder} видалено`
            });

            setTimeout(() => {
                setDeletingResult(initDeletingResult);

                triggerRefetch();
                setIsDeleteModalOpen(false);
            }, 1500);
        }
    }

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
                        {/* CONFIRM */}
                        <>
                            <Image
                                source={require("../../../assets/orders-screen/warning.png")}
                                style={styles.warningIcon}
                                resizeMode="contain"
                            />
                            <Text style={styles.modalTitle}>Видалити замовлення?</Text>
                            <Text style={styles.modalSubtitle}>Видалення замовлення №{idOrder}</Text>

                            {deletingResult.isVissible === null && <View style={styles.modalButtons}>
                                <Pressable
                                    style={styles.cancelButton}
                                    onPress={() => setIsDeleteModalOpen(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Відмінити</Text>
                                </Pressable>
                                <Pressable
                                    style={styles.deleteConfirmButton}
                                    onPress={deleteHandler}
                                >
                                    <Text style={styles.deleteConfirmButtonText}>Видалити</Text>
                                </Pressable>
                            </View>}
                        </>

                        {/* Success result */}
                        {deletingResult.isVissible === "success" &&
                            <SuccessMessage
                                title={deletingResult.title}
                                text={deletingResult.text}
                            />}
                        {/* Error result */}
                        {deletingResult.isVissible === "error" &&
                            <ErrorMessage
                                errorTitle={deletingResult.title}
                                errorText={deletingResult.text}
                                styles={{ top: 30 }}
                            />
                        }
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