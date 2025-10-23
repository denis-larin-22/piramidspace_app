import AnimatedWrapper from "../animation/AnimatedWrapper";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../theme/colors";
import { Fonts } from "../../theme/fonts";
import { tableStyles } from "./TableOrders";
import { fetchDeleteOrder, IOrder } from "../../lib/api/orders-screen/ordersList";
import { useEffect, useState } from "react";
import { getDataFromAcyncStorage } from "../../lib/async-storage/acyncStorage";
import { ASYNC_STORAGE_USER_LOGIN } from "../../lib/async-storage/asyncStorageKeys";
import { useCreateOrder } from "./NewOrderProvider";

function OrderItem({
    order,
    activeOrderId,
    setActiveOrderId,
    triggerRefetch
}: {
    order: IOrder,
    activeOrderId: number | null,
    setActiveOrderId: (id: number | null) => void,
    triggerRefetch: () => void
}) {
    const {
        ['N_заказа']: id,
        ['дата_заказа']: createDate,
        ["дата готовности"]: finishDate,
        ["ТТН перевозчика"]: ttn,
        ['комментарий']: comment,
        ["адрес доставки"]: deliveryAddress,
        ["Сумма розница"]: retailPrice,
        ["заказчик розница"]: customerRetail,
        ["комментарий менеджера"]: managerComment
    } = order;

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [loginValue, setLoginValue] = useState<string | undefined>(undefined);

    useEffect(() => {
        async function getLoginValue() {
            const login = await getDataFromAcyncStorage(ASYNC_STORAGE_USER_LOGIN);
            if (!login) return;

            setLoginValue(login);
        }

        getLoginValue();
    });

    return (
        <AnimatedWrapper
            key={id}
            offsetX={20}
            duration={400}
            style={styles.wrapper}
        >
            <Pressable
                style={({ pressed }) => [
                    styles.pressableRow,
                    activeOrderId !== id && styles.activeOrder,
                    pressed && styles.rowPressed,
                    {
                        backgroundColor: activeOrderId === null || activeOrderId === id ? 'white' : Colors.pale,
                    }
                ]}
                onPress={() => {
                    if (activeOrderId === id) {
                        setActiveOrderId(null);
                    } else {
                        setActiveOrderId(id);
                    }
                }}
            >
                <Text style={[styles.cell, tableStyles.column1, styles.link]}>
                    #{order['N_заказа']}
                </Text>
                <Text style={[styles.cell, tableStyles.column2]}>
                    {getFormatedOrderType(order['вид заказа'])}
                    {/* {order['вид заказа']} */}
                </Text>
                <Status statusValue={order['статус']} />
                <Text style={[styles.cell, tableStyles.column4]}>
                    {order['сумма']}
                </Text>
            </Pressable>

            {id === activeOrderId && (
                <AnimatedWrapper
                    useOpacity
                    offsetY={-10}
                    duration={200}
                    style={styles.detailsWrapper}
                >
                    <Pressable
                        style={styles.deleteBtn}
                        onPress={() => setIsDeleteModalOpen(true)}
                    >
                        <Image
                            source={require("../../assets/orders-screen/delete.webp")}
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
                                    source={require("../../assets/orders-screen/warning.png")}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        marginBottom: 20
                                    }}
                                    resizeMode="contain"
                                />
                                <Text style={{
                                    fontFamily: Fonts.comfortaa700,
                                    fontSize: 18,
                                    marginBottom: 5
                                }}>Видалити замовлення?</Text>
                                <Text style={{
                                    fontFamily: Fonts.openSans400,
                                    fontSize: 14,
                                    marginBottom: 30,
                                    color: Colors.gray
                                }}>Видалення замовлення №{id}</Text>

                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    gap: 20
                                }}>
                                    <Pressable style={{
                                        padding: 10,
                                        borderWidth: 1,
                                        borderColor: '#A2A2A870',
                                        borderRadius: 14,
                                    }}
                                        onPress={() => setIsDeleteModalOpen(false)}
                                    >
                                        <Text style={{
                                            fontFamily: Fonts.openSans400,
                                            color: Colors.gray
                                        }}>Відмінити</Text>
                                    </Pressable>
                                    <Pressable style={{
                                        padding: 10,
                                        borderRadius: 14,
                                        backgroundColor: Colors.blue
                                    }}
                                        onPress={async () => {
                                            if (!loginValue) return;

                                            const result = await fetchDeleteOrder({
                                                login: loginValue,
                                                order_N: id.toString(),
                                                userType: 'менеджер'
                                            });

                                            triggerRefetch();
                                            setIsDeleteModalOpen(false);
                                        }}
                                    >
                                        <Text style={{
                                            fontFamily: Fonts.openSans400,
                                            color: 'white'
                                        }}>Видалити</Text>
                                    </Pressable>
                                </View>
                            </AnimatedWrapper>
                        </AnimatedWrapper>
                    </Modal>


                    <View style={styles.detailsContainer}>
                        <Detail label="🗓️ Дата замовлення:" value={formatDateAndTime(createDate)} />
                        <Detail label="📦 Дата готовності:" value={finishDate ? formatDateAndTime(finishDate as string) : '—'} />
                        <Detail label="🚚 ТТН:" value={ttn} />
                        <Detail label="📍 Адреса:" value={deliveryAddress} borderBottom />
                        <Detail label="💰 Сума роздріб:" value={retailPrice} />
                        <Detail label="🛍️ Замовник роздріб:" value={customerRetail} borderBottom />
                        <Detail label="👤 Коментар менеджера:" value={managerComment} />
                        <Detail label="📝 Коментарій:" value={comment} />
                    </View>
                </AnimatedWrapper>
            )}
        </AnimatedWrapper>
    );
}

export default OrderItem;

function Status({ statusValue }: { statusValue: string }) {
    const status = getFormatedStatus(statusValue);

    return (
        <Text style={[styles.cell, tableStyles.column3, { backgroundColor: status.color }]}>
            {status.formatedStatus}
        </Text>
    );
}

function Detail({ label, value, borderBottom = false }: { label: string, value: string | number | null, borderBottom?: boolean }) {
    return (
        <View style={[styles.detailRow, borderBottom && styles.bordeBottom]}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value ? value : '—'}</Text>
        </View>
    );
}

function formatDateAndTime(dateString: string): string {
    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-');

    if (timePart) {
        const [hours, minutes] = timePart.split(':');
        return `${day}.${month}.${year} - ${hours}:${minutes}`;
    }

    return `${day}.${month}.${year}`;
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
            return { formatedStatus: 'видалений', color: '#E47B78' };
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
    },
    activeOrder: {
        borderBottomWidth: 2,
        borderColor: Colors.grayLight,
    },
    cell: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 12,
        lineHeight: 13,
        textAlignVertical: 'center',
    },
    link: {
        color: '#337ef7',
        fontFamily: Fonts.openSans400,
    },
    detailsWrapper: {
        borderTopWidth: 2,
        borderTopColor: Colors.pale,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#D9D9D9',
    },
    detailsContainer: {
        backgroundColor: 'white',
        padding: 5,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        position: 'relative',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 7,
        marginBottom: 4,
    },
    detailLabel: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 12,
        color: Colors.gray,
    },
    detailValue: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 12,
        lineHeight: 20,
        color: 'black',
        maxWidth: '60%',
    },
    rowPressed: {
        backgroundColor: Colors.grayLight,
    },
    bordeBottom: {
        borderBottomWidth: 2,
        borderColor: Colors.grayLight,
        paddingBottom: 5,
        marginBottom: 5
    },
    deleteBtn: {
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
});
