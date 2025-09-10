import {
    Image,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native";
import { Colors } from "../theme/colors";
import { Fragment, useState } from "react";
import { Fonts } from "../theme/fonts";
import OrdersHeader from "../components/orders-screen/OrdersHeader";
import NumberAndStatus from "../components/orders-screen/NumberAndStatus";
import TableOrders from "../components/orders-screen/TableOrders";
import AnimatedWrapper from "../components/animation/AnimatedWrapper";
import { useOrdersList } from "../lib/hooks/useOrdersList";
import { useNetworkStatus } from "../lib/hooks/useNetworkStatus";
import BackButton from "../components/ui/BackButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppStack";
import AddNewOrder from "../components/orders-screen/AddNewOrder";

export interface IStatusColors {
    color: string;
    status: string;
    origin: string;
}

export const STATUS_COLORS_OBJECTS: IStatusColors[] = [
    { color: '#9370DB', status: 'формується відвантаження', origin: "формируется отгрузка" },
    { color: '#5ea1bc', status: 'попередній', origin: 'предварительный' },
    { color: '#ffccc6', status: 'новий', origin: 'новый' },
    { color: '#f0e68c', status: 'в обробці', origin: 'в обработке' },
    { color: '#b4ddb4', status: 'у виробництві', origin: 'в производстве' },
    { color: '#FFA500', status: 'виготовлені', origin: 'изготовлен' },
    { color: '#E47B78', status: 'видалений', origin: 'удален' },
    { color: '#f37474', status: 'відкладені', origin: 'отложен' },
    { color: '#FFFFFF', status: 'інші', origin: '' },
];

export type OrdersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "OrdersScreen">;

const ORDERS_PER_PAGE = 25;

function OrdersScreen({ navigation }: { navigation: OrdersScreenNavigationProp }) {
    const { isConnected } = useNetworkStatus();

    const [activePage, setActivePage] = useState(0);
    const [searchOrderId, setSearchOrderId] = useState("");
    const [searchOrderStatus, setSearchOrderStatus] = useState("");

    const { ordersList, isLoading } = useOrdersList(
        searchOrderId,
        searchOrderStatus,
        activePage,
        ORDERS_PER_PAGE
    );

    // вычисляем список и количество страниц напрямую из ordersList
    const listToRender = ordersList?.data ?? [];
    const totalPages = ordersList?.last_page ?? 0;

    const statusHandler = (status: string) => {
        setSearchOrderStatus(status);
        setActivePage(0); // сброс страницы при смене фильтра
    };

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

                <NumberAndStatus
                    statusColorsObjects={STATUS_COLORS_OBJECTS}
                    statusValue={searchOrderStatus}
                    statusHandler={statusHandler}
                    idValue={searchOrderId}
                    idValueHandler={setSearchOrderId}
                />

                <TableOrders
                    isLoading={isLoading}
                    ordersList={listToRender}
                    activePage={activePage}
                    totalPages={totalPages}
                    setActivePage={setActivePage}
                />

                <AddNewOrder />

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
