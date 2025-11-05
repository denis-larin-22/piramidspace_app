import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { Image, Modal, Pressable, StyleSheet, Text, TextStyle } from "react-native";
import { Colors } from "../../../theme/colors";
import { Fonts } from "../../../theme/fonts";
import { tableStyles } from "../TableOrders";
import { IOrder } from "../../../lib/api/orders-screen/ordersList";
import { useEffect, useState } from "react";
import { getDataFromAcyncStorage } from "../../../lib/async-storage/acyncStorage";
import { ASYNC_STORAGE_USER_LOGIN } from "../../../lib/async-storage/asyncStorageKeys";
import DeleteOrderButton from "./DeleteOrderButton";
import OrderDetails from "./OrderDetails";

function Order({
    order,
    triggerRefetch
}: {
    order: IOrder,
    triggerRefetch: () => void
}) {
    const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [loginValue, setLoginValue] = useState<string | undefined>(undefined);

    useEffect(() => {
        async function getLoginValue() {
            const login = await getDataFromAcyncStorage(ASYNC_STORAGE_USER_LOGIN);
            if (!login) return;

            setLoginValue(login);
        }

        getLoginValue();
    }, []);

    return (
        <AnimatedWrapper
            offsetX={20}
            duration={400}
            style={styles.wrapper}
        >
            <Pressable
                style={[styles.pressableRow, {
                    backgroundColor: order['статус'] === 'удален' ? Colors.grayLight : 'white',
                    opacity: order['статус'] === 'удален' ? 0.6 : 1,
                }]}
                onPress={() => {
                    setIsDetailOpen(true);
                }}
            >
                <Text style={[styles.cell, tableStyles.column1, styles.link]}>
                    #{order['N_заказа']}
                </Text>
                <Text style={[styles.cell, tableStyles.column2]}>
                    {getFormatedOrderType(order['вид заказа'])}
                </Text>
                <Status statusValue={order['статус']} />
                <Text style={[styles.cell, tableStyles.column4]}>
                    {order['сумма']}
                </Text>
            </Pressable>

            <Modal visible={isDetailOpen} transparent>
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
                        <Pressable
                            onPress={() => setIsDetailOpen(false)}
                            style={styles.closeDetailBtn}
                        >
                            <Image
                                source={require('../../../assets/orders-screen/close.webp')}
                                style={styles.closeDetailIcon}
                            />
                        </Pressable>

                        {order['статус'] === 'удален' ?
                            null
                            :
                            <DeleteOrderButton
                                isDeleteModalOpen={isDeleteModalOpen}
                                setIsDeleteModalOpen={setIsDeleteModalOpen}
                                loginValue={loginValue}
                                idOrder={order["N_заказа"]}
                                triggerRefetch={triggerRefetch}
                            />
                        }

                        <OrderDetails order={order} />
                    </AnimatedWrapper>
                </AnimatedWrapper>
            </Modal>
        </AnimatedWrapper>
    );
}

export default Order;

export function Status({ statusValue, style }: { statusValue: string, style?: TextStyle }) {
    const status = getFormatedStatus(statusValue);

    return (
        <Text style={[styles.cell, tableStyles.column3, { backgroundColor: status.color }, { ...style }]}>
            {status.formatedStatus}
        </Text>
    );
}

function getFormatedOrderType(type: string) {
    if (type === null) return "-";

    switch (type.toLowerCase()) {
        case 'горизонтальные жалюзи':
            return 'горизонтальні жалюзі';
        case 'вертикальные жалюзи':
            return 'вертикальні жалюзі';
        case 'рулонка':
        case 'рулонные жалюзи':
            return 'рулонні жалюзі';
        case 'комплектующие':
            return 'комплектуючі';
        case 'рекламная продукция':
            return 'рекламна продукція';
        case 'деньночь':
        case 'день-ночь':
            return 'день-ніч';
        case 'тип заказа не определен':
            return 'тип не визначено';
        default:
            return type;
    }
}

function getFormatedStatus(status: string) {
    switch (status) {
        case 'удален':
            return { formatedStatus: 'видалений', color: '#A2A2A8' };
        case 'у виробництві':
            return { formatedStatus: 'у виробництві', color: '#b4ddb4' };
        case 'изготовлен':
            return { formatedStatus: 'виготовлені', color: '#FFA500' };
        case 'предварительный':
            return { formatedStatus: 'попередній', color: '#5ea1bc' };
        default:
            return { formatedStatus: status, color: '#FFFFFF' };
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'column',
    },
    pressableRow: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        // backgroundColor: 'white',
        borderBottomWidth: 2,
        borderColor: Colors.pale
    },
    activeOrder: {
        borderBottomWidth: 2,
        borderColor: Colors.grayLight,
    },
    cell: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 12,
        lineHeight: 13,
        color: 'black',
        textAlignVertical: 'center',
    },
    link: {
        color: '#337ef7',
        fontFamily: Fonts.openSans400,
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
    },
    closeDetailBtn: {
        width: 30,
        height: 30,
        backgroundColor: Colors.grayLight,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        position: 'absolute',
        right: 10,
        top: 10,
        zIndex: 1
    },
    closeDetailIcon: {
        width: 20,
        height: 20,
    },
});