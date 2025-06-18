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
                        <AddOrderButton />
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
function AddOrderButton() {
    const [isVissible, setIsVissible] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVissible(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {isVissible && <AnimatedWrapper
                useOpacity
                offsetX={100}
                delay={1000}
                duration={600}
                style={styles.addBtnNotice}>
                <Text style={styles.addBtnNoticeText}>Додати замовлення</Text>
            </AnimatedWrapper>
            }

            <AnimatedWrapper
                useOpacity
                offsetX={50}
                duration={300}
                delay={400}
            >
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>
                        +
                    </Text>
                </TouchableOpacity>
            </AnimatedWrapper>
        </>
    );
}

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
    addButton: {
        width: 60,
        height: 60,
        alignSelf: 'flex-end',
        borderRadius: 50,
        overflow: "hidden",
        marginBottom: 10,
        backgroundColor: Colors.blue
    },
    addButtonText: {
        color: "white",
        fontSize: 36,
        lineHeight: 45,
        fontFamily: Fonts.comfortaa600,
        width: '100%',
        textAlign: "center",
        paddingVertical: 9
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
    addBtnNotice: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingBottom: 5,
        paddingTop: 2,
        width: 155,
        borderRadius: 15,
        position: 'absolute',
        bottom: 28,
        alignSelf: 'flex-end',
        right: 75
    },
    addBtnNoticeText: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 12,
        opacity: 0.5
    }
});
