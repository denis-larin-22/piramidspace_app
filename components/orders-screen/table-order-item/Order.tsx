import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { Pressable, StyleSheet, Text, TextStyle } from "react-native";
import { Colors } from "../../../theme/colors";
import { Fonts } from "../../../theme/fonts";
import { tableStyles } from "../TableOrders";
import { IOrder } from "../../../lib/api/orders-screen/ordersList";
import { getFormatedOrderType, getFormatedStatus } from "../../../lib/utils";

function Order({
    order,
    openHandler,
}: {
    order: IOrder,
    openHandler: () => void,
}) {

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
                onPress={openHandler}
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

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'column',
    },
    pressableRow: {
        flexDirection: 'row',
        paddingHorizontal: 10,
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
});