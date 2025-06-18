import { useState } from "react";
import { IOrder } from "../../lib/api/orders";
import AnimatedWrapper from "../animation/AnimatedWrapper";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../theme/colors";
import { Fonts } from "../../theme/fonts";
import { tableStyles } from "./TableOrders";

function OrderItem({ order, index }: { order: IOrder, index: number }) {
    const {
        ['дата_заказа']: createDate,
        ["дата готовности"]: finishDate,
        ["ТТН перевозчика"]: ttn,
        ['комментарий']: comment,
        ["адрес доставки"]: deliveryAddress,
        ["Сумма розница"]: retailPrice,
        ["заказчик розница"]: customerRetail,
        ["комментарий менеджера"]: managerComment
    } = order;

    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <AnimatedWrapper
            key={order['N_заказа'] + index}
            useOpacity
            offsetY={20}
            style={styles.wrapper}
        >
            <Pressable
                style={({ pressed }) => [
                    styles.pressableRow,
                    !isOpen && styles.pressableRowBorder,
                    pressed && styles.rowPressed
                ]}
                onPress={() => setIsOpen(!isOpen)}
            >
                <Text style={[styles.cell, tableStyles.column1, styles.link]}>
                    #{order['N_заказа']}
                </Text>
                <Text style={[styles.cell, tableStyles.column2]}>
                    {order['вид заказа'].toLowerCase()}
                </Text>
                <Status statusValue={order['статус']} />
                <Text style={[styles.cell, tableStyles.column4]}>
                    {order['сумма']}
                </Text>
            </Pressable>

            {isOpen && (
                <AnimatedWrapper
                    useOpacity
                    offsetY={-30}
                    duration={100}
                    style={styles.detailsWrapper}
                >
                    <View style={styles.detailsContainer}>
                        <Image
                            source={require('../../assets/orders-screen/arrow-bottom.png')}
                            style={{
                                width: 50,
                                height: 50,
                                position: 'absolute',
                                top: 0,
                                right: 0
                            }}
                            resizeMode="center"
                        />
                        <Detail label="🗓️ Дата замовлення:" value={formatDateAndTime(createDate)} />
                        <Detail label="📦 Дата готовності:" value={finishDate ? formatDateAndTime(finishDate as string) : '—'} />
                        <Detail label="🚚 ТТН:" value={ttn} />
                        <Detail label="📍 Адреса:" value={deliveryAddress} borderBottom />
                        <Detail label="💰 Сума роздріб:" value={retailPrice} />
                        <Detail label="🛍️ Замовник роздріб:" value={customerRetail} borderBottom />
                        <Detail label="👤 Коментар менеджера:" value={managerComment} />
                        <Detail label="📝 Коментарій:" value={comment.length ? comment : '—'} />
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
    const [hours, minutes] = timePart.split(':');
    return `${day}.${month}.${year} - ${hours}:${minutes}`;
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
    pressableRowBorder: {
        borderBottomWidth: 1,
        borderColor: '#D9D9D9',
    },
    cell: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 11,
        lineHeight: 12,
        textAlignVertical: 'center',
    },
    link: {
        color: '#337ef7',
        fontFamily: Fonts.openSans400,
    },
    detailsWrapper: {
        marginBottom: 10,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderColor: '#D9D9D9',
    },
    detailsContainer: {
        backgroundColor: Colors.pale,
        padding: 5,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        position: 'relative'
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 7,
        marginBottom: 4,
    },
    detailLabel: {
        fontFamily: Fonts.openSans400,
        fontSize: 11,
        color: Colors.gray,
    },
    detailValue: {
        fontFamily: Fonts.openSans700,
        fontSize: 11,
        color: Colors.gray,
        flexGrow: 1,
        maxWidth: '75%'
    },
    rowPressed: {
        backgroundColor: Colors.pale,
    },
    bordeBottom: {
        borderBottomWidth: 1,
        borderColor: '#A2A2A830',
        paddingBottom: 5,
        marginBottom: 5
    }
});
