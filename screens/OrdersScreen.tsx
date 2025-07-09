// OrdersScreen.tsx
import {
    Image,
    ImageBackground,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { Colors } from "../theme/colors";
import { Fragment, useEffect, useState } from "react";
import { Fonts } from "../theme/fonts";
import OrdersHeader from "../components/orders-screen/OrdersHeader";
import NumberAndStatus from "../components/orders-screen/NumberAndStatus";
import TableOrders from "../components/orders-screen/TableOrders";
import AnimatedWrapper from "../components/animation/AnimatedWrapper";
import LoaderWithWords from "../components/ui/LoaderWithWords";
import { useOrders } from "../lib/hooks/useOrders";
import { useNetworkStatus } from "../lib/hooks/useNetworkStatus";
import { IOrder } from "../lib/api/orders";
import BackButton from "../components/ui/BackButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppStack";
import AddNewOrder from "../components/orders-screen/AddNewOrder";

export interface IStatusColors {
    color: string;
    status: string;
}

export const STATUS_COLORS_OBJECTS: IStatusColors[] = [
    { color: '#9370DB', status: 'формується відвантаження' },
    { color: '#5ea1bc', status: 'попередній' },
    { color: '#ffccc6', status: 'новий' },
    { color: '#f0e68c', status: 'в обробці' },
    { color: '#b4ddb4', status: 'у виробництві' },
    { color: '#FFA500', status: 'виготовлені' },
    { color: '#E47B78', status: 'видалений' },
    { color: '#f37474', status: 'відкладені' },
    { color: '#FFFFFF', status: 'інші' },
];

export type OrdersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "OrdersScreen">;

function OrdersScreen({ navigation }: { navigation: OrdersScreenNavigationProp }) {
    const { isConnected } = useNetworkStatus();
    const { ordersList, isLoading } = useOrders();
    const [listToRender, setListToRender] = useState<IOrder[]>([]);


    // FICTION /////////////////////////////////////
    // const isLoading = false;
    // const ordersList = [{ "1c": null, "IP": null, "N_заказа": 194095, "sale_diler": 0, "seller": { "1c": 0, "активен": "0", "имя продавца": "pas2", "логин дилера": "test@test", "логин продавца": "pas123123", "отчество продавца": "pas3", "пароль продавца": "$2y$10$ghiWZcQJwtkP9JyRItznYe2Rc951cpd0.x5I1T", "почта": "pas1@gmail.com", "статус": "Активен", "телефон": "+38 (111) 111-1111", "фамилия продавца": "pas1" }, "ВидАдресаВЗаказе": null, "Сумма розница": null, "ТТН перевозчика": null, "адрес доставки": null, "блок": null, "вид заказа": "горизонтальные жалюзи", "дата готовности": null, "дата_заказа": "2019-08-09 12:28:31", "заказчик розница": null, "замер доставка установка розница": null, "комментарий": "", "комментарий менеджера": "заказ удален менеджером Менеджер", "менеджер": null, "площадь, м.кв.": 3.76, "пользователь": "test@test", "предопл": null, "розничная сумма": null, "скидка": "0.00", "статус": "удален", "статус оплати": null, "сумма": 2232.18, "тел розница": null }, { "1c": null, "IP": null, "N_заказа": 194096, "sale_diler": 0, "seller": { "1c": 0, "активен": "0", "имя продавца": "pas2", "логин дилера": "test@test", "логин продавца": "pas123123", "отчество продавца": "pas3", "пароль продавца": "$2y$10$ghiWZcQJwtkP9JyRItznYe2Rc951cpd0.x5I1T", "почта": "pas1@gmail.com", "статус": "Активен", "телефон": "+38 (111) 111-1111", "фамилия продавца": "pas1" }, "ВидАдресаВЗаказе": null, "Сумма розница": null, "ТТН перевозчика": null, "адрес доставки": null, "блок": null, "вид заказа": "горизонтальные жалюзи", "дата готовности": null, "дата_заказа": "2019-08-09 12:32:27", "заказчик розница": null, "замер доставка установка розница": null, "комментарий": "", "комментарий менеджера": "заказ удален менеджером Менеджер", "менеджер": null, "площадь, м.кв.": 3.76, "пользователь": "test@test", "предопл": null, "розничная сумма": null, "скидка": "0.00", "статус": "удален", "статус оплати": null, "сумма": 86.85, "тел розница": null }, { "1c": null, "IP": null, "N_заказа": 194140, "sale_diler": 0, "seller": { "1c": 0, "активен": "0", "имя продавца": "pas2", "логин дилера": "test@test", "логин продавца": "pas123123", "отчество продавца": "pas3", "пароль продавца": "$2y$10$ghiWZcQJwtkP9JyRItznYe2Rc951cpd0.x5I1T", "почта": "pas1@gmail.com", "статус": "Активен", "телефон": "+38 (111) 111-1111", "фамилия продавца": "pas1" }, "ВидАдресаВЗаказе": null, "Сумма розница": null, "ТТН перевозчика": "", "адрес доставки": null, "блок": null, "вид заказа": "вертикальные жалюзи", "дата готовности": "0000-00-00", "дата_заказа": "2019-08-12 09:58:08", "заказчик розница": null, "замер доставка установка розница": null, "комментарий": "(434.431,432)", "комментарий менеджера": "заказ удален менеджером Менеджер", "менеджер": "", "площадь, м.кв.": 17.22, "пользователь": "test@test", "предопл": null, "розничная сумма": null, "скидка": "0.00", "статус": "удален", "статус оплати": null, "сумма": 449.43, "тел розница": null }, { "1c": null, "IP": null, "N_заказа": 195209, "sale_diler": 0, "seller": { "1c": 0, "активен": "0", "имя продавца": "pas2", "логин дилера": "test@test", "логин продавца": "pas123123", "отчество продавца": "pas3", "пароль продавца": "$2y$10$ghiWZcQJwtkP9JyRItznYe2Rc951cpd0.x5I1T", "почта": "pas1@gmail.com", "статус": "Активен", "телефон": "+38 (111) 111-1111", "фамилия продавца": "pas1" }, "ВидАдресаВЗаказе": null, "Сумма розница": null, "ТТН перевозчика": null, "адрес доставки": null, "блок": null, "вид заказа": "горизонтальные жалюзи", "дата готовности": null, "дата_заказа": "2019-09-17 14:35:53", "заказчик розница": null, "замер доставка установка розница": null, "комментарий": "", "комментарий менеджера": "заказ удален менеджером Менеджер", "менеджер": null, "площадь, м.кв.": 1, "пользователь": "test@test", "предопл": null, "розничная сумма": null, "скидка": "0.00", "статус": "удален", "статус оплати": null, "сумма": 16.2, "тел розница": null }, { "1c": null, "IP": null, "N_заказа": 195212, "sale_diler": 0, "seller": { "1c": 0, "активен": "0", "имя продавца": "pas2", "логин дилера": "test@test", "логин продавца": "pas123123", "отчество продавца": "pas3", "пароль продавца": "$2y$10$ghiWZcQJwtkP9JyRItznYe2Rc951cpd0.x5I1T", "почта": "pas1@gmail.com", "статус": "Активен", "телефон": "+38 (111) 111-1111", "фамилия продавца": "pas1" }, "ВидАдресаВЗаказе": null, "Сумма розница": null, "ТТН перевозчика": null, "адрес доставки": null, "блок": null, "вид заказа": "горизонтальные жалюзи", "дата готовности": null, "дата_заказа": "2019-09-17 14:40:54", "заказчик розница": null, "замер доставка установка розница": null, "комментарий": "", "комментарий менеджера": "заказ удален менеджером Менеджер", "менеджер": null, "площадь, м.кв.": 1, "пользователь": "test@test", "предопл": null, "розничная сумма": null, "скидка": "0.00", "статус": "удален", "статус оплати": null, "сумма": 0, "тел розница": null }, { "1c": null, "IP": null, "N_заказа": 195734, "sale_diler": 0, "seller": { "1c": 0, "активен": "0", "имя продавца": "pas2", "логин дилера": "test@test", "логин продавца": "pas123123", "отчество продавца": "pas3", "пароль продавца": "$2y$10$ghiWZcQJwtkP9JyRItznYe2Rc951cpd0.x5I1T", "почта": "pas1@gmail.com", "статус": "Активен", "телефон": "+38 (111) 111-1111", "фамилия продавца": "pas1" }, "ВидАдресаВЗаказе": null, "Сумма розница": null, "ТТН перевозчика": null, "адрес доставки": null, "блок": null, "вид заказа": "Рулонка", "дата готовности": null, "дата_заказа": "2019-10-04 15:41:27", "заказчик розница": null, "замер доставка установка розница": null, "комментарий": "", "комментарий менеджера": "заказ удален менеджером Менеджер", "менеджер": null, "площадь, м.кв.": 5.82, "пользователь": "test@test", "предопл": null, "розничная сумма": null, "скидка": "0.00", "статус": "удален", "статус оплати": null, "сумма": 226.2, "тел розница": null }, { "1c": null, "IP": null, "N_заказа": 195739, "sale_diler": 0, "seller": { "1c": 0, "активен": "0", "имя продавца": "pas2", "логин дилера": "test@test", "логин продавца": "pas123123", "отчество продавца": "pas3", "пароль продавца": "$2y$10$ghiWZcQJwtkP9JyRItznYe2Rc951cpd0.x5I1T", "почта": "pas1@gmail.com", "статус": "Активен", "телефон": "+38 (111) 111-1111", "фамилия продавца": "pas1" }, "ВидАдресаВЗаказе": null, "Сумма розница": null, "ТТН перевозчика": null, "адрес доставки": null, "блок": null, "вид заказа": "Рулонка", "дата готовности": "0000-00-00", "дата_заказа": "2019-10-04 16:16:59", "заказчик розница": null, "замер доставка установка розница": null, "комментарий": "", "комментарий менеджера": "заказ удален менеджером Менеджер", "менеджер": null, "площадь, м.кв.": 5.82, "пользователь": "test@test", "предопл": null, "розничная сумма": null, "скидка": "0.00", "статус": "удален", "статус оплати": null, "сумма": 226.2, "тел розница": null }, { "1c": null, "IP": null, "N_заказа": 195767, "sale_diler": 0, "seller": { "1c": 0, "активен": "0", "имя продавца": "pas2", "логин дилера": "test@test", "логин продавца": "pas123123", "отчество продавца": "pas3", "пароль продавца": "$2y$10$ghiWZcQJwtkP9JyRItznYe2Rc951cpd0.x5I1T", "почта": "pas1@gmail.com", "статус": "Активен", "телефон": "+38 (111) 111-1111", "фамилия продавца": "pas1" }, "ВидАдресаВЗаказе": null, "Сумма розница": null, "ТТН перевозчика": null, "адрес доставки": null, "блок": null, "вид заказа": "Рулонка", "дата готовности": null, "дата_заказа": "2019-10-07 10:19:13", "заказчик розница": null, "замер доставка установка розница": null, "комментарий": "", "комментарий менеджера": "заказ удален менеджером Менеджер", "менеджер": null, "площадь, м.кв.": 5.82, "пользователь": "test@test", "предопл": null, "розничная сумма": null, "скидка": "0.00", "статус": "удален", "статус оплати": null, "сумма": 226.2, "тел розница": null }, { "1c": null, "IP": null, "N_заказа": 195780, "sale_diler": 0, "seller": { "1c": 0, "активен": "0", "имя продавца": "pas2", "логин дилера": "test@test", "логин продавца": "pas123123", "отчество продавца": "pas3", "пароль продавца": "$2y$10$ghiWZcQJwtkP9JyRItznYe2Rc951cpd0.x5I1T", "почта": "pas1@gmail.com", "статус": "Активен", "телефон": "+38 (111) 111-1111", "фамилия продавца": "pas1" }, "ВидАдресаВЗаказе": null, "Сумма розница": null, "ТТН перевозчика": null, "адрес доставки": null, "блок": null, "вид заказа": "Рулонка", "дата готовности": null, "дата_заказа": "2019-10-07 11:47:21", "заказчик розница": null, "замер доставка установка розница": null, "комментарий": "", "комментарий менеджера": "заказ удален менеджером Менеджер", "менеджер": null, "площадь, м.кв.": 5.82, "пользователь": "test@test", "предопл": null, "розничная сумма": null, "скидка": "0.00", "статус": "удален", "статус оплати": null, "сумма": 226.2, "тел розница": null }, { "1c": null, "IP": null, "N_заказа": 195781, "sale_diler": 0, "seller": { "1c": 0, "активен": "0", "имя продавца": "pas2", "логин дилера": "test@test", "логин продавца": "pas123123", "отчество продавца": "pas3", "пароль продавца": "$2y$10$ghiWZcQJwtkP9JyRItznYe2Rc951cpd0.x5I1T", "почта": "pas1@gmail.com", "статус": "Активен", "телефон": "+38 (111) 111-1111", "фамилия продавца": "pas1" }, "ВидАдресаВЗаказе": null, "Сумма розница": null, "ТТН перевозчика": null, "адрес доставки": null, "блок": null, "вид заказа": "Рулонка", "дата готовности": null, "дата_заказа": "2019-10-07 11:47:31", "заказчик розница": null, "замер доставка установка розница": null, "комментарий": "", "комментарий менеджера": "заказ удален менеджером Менеджер", "менеджер": null, "площадь, м.кв.": 5.82, "пользователь": "test@test", "предопл": null, "розничная сумма": null, "скидка": "0.00", "статус": "удален", "статус оплати": null, "сумма": 226.2, "тел розница": null }];

    useEffect(() => {
        if (!isLoading) {
            setListToRender(ordersList);
        }
    }, [isLoading]);

    function getOrderByNumber(numberValue: string) {
        if (numberValue === '') {
            setListToRender(ordersList.reverse());
            return;
        }

        const searchResult = ordersList.find((order) => order['N_заказа'] === +numberValue);

        if (searchResult) {
            setListToRender([searchResult]);
        } else {
            setListToRender([]);
        }
    }

    function getOrdersByStatus(status: string | null) {
        if (status === null) {
            setListToRender(ordersList.reverse());
        } else {
            const result = ordersList.filter((order) => order['статус'] === status);
            setListToRender(result);
        }
    }

    return (
        <Fragment>
            <StatusBar
                hidden={false}
                translucent={false}
                barStyle="dark-content"
                backgroundColor={Colors.pale}
            />

            <View style={styles.container}>
                <OrdersHeader />
                {!isConnected && <Warning />}

                {isLoading ? (
                    <AnimatedWrapper
                        useOpacity
                        offsetX={-50}
                        delay={200}
                        style={styles.loaderWrapper}>
                        <LoaderWithWords radius={100} />
                    </AnimatedWrapper>
                ) : (
                    <>
                        <NumberAndStatus
                            statusColorsObjects={STATUS_COLORS_OBJECTS}
                            getOrderByNumberHandler={getOrderByNumber}
                            getOrdersByStatusHandler={getOrdersByStatus}
                        />
                        <TableOrders ordersList={listToRender.reverse()} />
                        <AddNewOrder />
                    </>
                )}
                <BackButton
                    styles={styles.backButton}
                    useOpacity
                    offsetX={-30}
                    delay={100}
                    onPressAction={() => navigation.goBack()}
                />
            </View>
        </Fragment>
    );
}

export default OrdersScreen;

// UI
function Warning() {
    return (
        <AnimatedWrapper
            useOpacity
            offsetX={-50}
            delay={200}
            style={styles.warningWrapper}>
            <View style={styles.warningRow}>
                <View style={styles.warningIconWrapper}>
                    <Image
                        source={require('../assets/orders-screen/no-wifi.png')}
                        style={styles.warningIcon}
                    />
                </View>
                <Text style={styles.warningText}>
                    Відсутнє інтренет з'єднання
                </Text>
            </View>
            <Text style={styles.warningSubText}>
                Для оновлення списку замовлень підключіться до інтернету
            </Text>
        </AnimatedWrapper>
    );
}

// styles
const styles = StyleSheet.create({
    container: {
        height: '100%',
        paddingHorizontal: 20,
        paddingTop: 16,
        backgroundColor: Colors.pale,
    },
    loaderWrapper: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    warningWrapper: {
        alignItems: 'center',
    },
    warningRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 10
    },
    warningIconWrapper: {
        width: 18,
        height: 18,
    },
    warningIcon: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    warningText: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 16
    },
    warningSubText: {
        fontFamily: Fonts.openSans400,
        fontSize: 12,
        textAlign: 'center',
        color: Colors.gray
    },
    backButton: {
        position: 'absolute',
        bottom: 10,
        left: 10
    },
});
