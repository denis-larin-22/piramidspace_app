import { Modal, StyleSheet, View } from "react-native";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import OrderDetails from "./OrderDetails";
import EditOrder from "./EditOrder";
import DeleteOrderButton from "./DeleteOrderButton";
import { CloseButton } from "../../ui/CloseButton";
import { Colors } from "../../../theme/colors";
import { useEffect, useState } from "react";
import { fetchOrderById, IOrder, IOrderList } from "../../../lib/api/orders-screen/ordersList";
import { getDataFromAcyncStorage } from "../../../lib/async-storage/acyncStorage";
import { ASYNC_STORAGE_USER_LOGIN } from "../../../lib/async-storage/asyncStorageKeys";
import Loader from "../../ui/Loader";
import RestoreOrder from "../restore-order/RestoreOrder";
import { updateUserInfoObject } from "../../../screens/OrdersScreen";

function ModalOrder({
    isOpen,
    orderId,
    closeHandler,
    triggerRefetch
}: {
    isOpen: boolean,
    orderId: number,
    closeHandler: () => void,
    triggerRefetch: () => void
}) {
    updateUserInfoObject(); // updating user info object for actual units value (см/мм)

    const [order, setOrder] = useState<null | IOrder>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [loginValue, setLoginValue] = useState<string | undefined>(undefined);
    const [hasUpdates, setHasUpdates] = useState(false);

    useEffect(() => {
        getData(orderId.toFixed(0));
    }, []);

    async function getData(idOrder: string) {
        const login = await getDataFromAcyncStorage(ASYNC_STORAGE_USER_LOGIN);
        if (!login) return;
        setLoginValue(login);

        const orderResponse = await fetchOrderById(login, idOrder, 1) as IOrderList;
        const orderObjectData = orderResponse.data[0];

        // Filtration from "Замер", "Установка", "Фиксация" and another services except tkan list
        const orderObject: IOrder = {
            ...orderObjectData,
            items: orderObjectData.items
        }

        setOrder(orderObject);
    }

    function updateAfterEditHandler() {
        getData(orderId.toFixed(0));
        setHasUpdates(true);
    }

    // VALID GROUPS FOR EDITING !!!!
    const editableTypes = ['day', 'roller', 'horizontal', 'vertical'] as const;

    return (
        <Modal
            visible={isOpen}
            transparent={true}
            animationType="fade"
            statusBarTranslucent={true}
            onRequestClose={closeHandler}
        >
            <AnimatedWrapper
                style={styles.modalOverlay}
                useOpacity
                duration={200}
            >
                <AnimatedWrapper
                    useOpacity
                    useScale
                    delay={100}
                    duration={200}
                    style={styles.modalContent}
                >
                    {order ?
                        <>
                            {/* =================== ORDER DETAILS =================== */}
                            <OrderDetails order={order} />
                            {/* =================== ORDER DETAILS =================== */}

                            <View style={styles.buttonsWrap}>

                                {order['статус'] === 'удален' ?
                                    null
                                    :
                                    <>
                                        {/* Edit button */}
                                        {editableTypes.includes(order["вид заказа"] as typeof editableTypes[number]) && (
                                            <AnimatedWrapper offsetY={20} delay={400}>
                                                <EditOrder
                                                    currentOrder={order}
                                                    updateAfterEditHandler={updateAfterEditHandler}
                                                />
                                            </AnimatedWrapper>
                                        )}

                                        {/* Delete button */}
                                        <AnimatedWrapper offsetY={20} delay={300}>
                                            <DeleteOrderButton
                                                isDeleteModalOpen={isDeleteModalOpen}
                                                setIsDeleteModalOpen={setIsDeleteModalOpen}
                                                loginValue={loginValue}
                                                idOrder={order["N_заказа"]}
                                                triggerRefetch={triggerRefetch}
                                            />
                                        </AnimatedWrapper>
                                    </>
                                }
                                {/* Restore button */}
                                {order['статус'] === "удален" &&
                                    <AnimatedWrapper offsetY={20} delay={200}>
                                        <RestoreOrder
                                            currentOrder={order}
                                            updateAfterRestoreHandler={triggerRefetch}
                                        />
                                    </AnimatedWrapper>
                                }
                                {/* Close button */}
                                <AnimatedWrapper offsetY={20} delay={220}>
                                    <CloseButton closeHandler={() => {
                                        if (hasUpdates) {
                                            triggerRefetch();
                                        } else {
                                            closeHandler()
                                        }
                                    }} />
                                </AnimatedWrapper>
                            </View>
                        </>
                        :
                        <View style={styles.loaderWrap}>
                            <Loader radius={100} />
                        </View>
                    }
                </AnimatedWrapper>
            </AnimatedWrapper>
        </Modal>
    )
}

export default ModalOrder;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
    },
    modalContent: {
        backgroundColor: Colors.pale,
        paddingVertical: 20,
        paddingHorizontal: 12,
        borderRadius: 13,
        width: '92%',
        maxHeight: '92%',
        top: -30
    },
    buttonsWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        position: 'absolute',
        bottom: -65,
        right: 0,
    },
    loaderWrap: {
        height: 300,
        alignItems: 'center',
        justifyContent: 'center'
    }
});