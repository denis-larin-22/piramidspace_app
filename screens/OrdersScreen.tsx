import { ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../theme/colors";
import { Fragment } from "react";
import { Fonts } from "../theme/fonts";
import OrdersHeader from "../components/orders-screen/OrdersHeader";
import NumberAndStatus from "../components/orders-screen/NumberAndStatus";
import TableOrders from "../components/orders-screen/TableOrders";
import AnimatedWrapper from "../components/animation/AnimatedWrapper";

export interface IStatusColors {
    color: string;
    status: string;
}

export const STATUS_COLORS_OBJECTS: IStatusColors[] = [
    { color: '#AFFFA5', status: 'у виробництві' },
    { color: '#8E75D5', status: '' },
    { color: '#62BDEA', status: 'попередній' },
    { color: '#FFEE6D', status: 'в обробці' },
    { color: '#F3A83C', status: '' },
    { color: '#2A343A', status: '' },
    { color: '#E47B78', status: '' },
    { color: '#FFFFFF', status: '' },
];

function OrdersScreen() {
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
                <NumberAndStatus statusColorsObjects={STATUS_COLORS_OBJECTS} />
                <TableOrders />
                <AddOrderButton />
            </View>
        </Fragment>
    );
}

export default OrdersScreen;

// styles
const styles = StyleSheet.create({
    container: {
        height: '100%',
        paddingHorizontal: 20,
        paddingTop: 16,
        backgroundColor: Colors.pale,
    },
    addButton: {
        borderRadius: 31,
        overflow: "hidden",
        marginBottom: 10
    },
    addButtonText: {
        color: "white",
        fontSize: 16,
        fontFamily: Fonts.comfortaa600,
        width: '100%',
        textAlign: "center",
        paddingVertical: 9
    }
});

// UI
function AddOrderButton() {
    return (
        <AnimatedWrapper
            useOpacity
            offsetX={50}
            duration={300}
            delay={400}
        >
            <TouchableOpacity
                // onPress={loginButtonProps.onPress}
                style={styles.addButton}
            >
                <ImageBackground source={require('../assets/gradient.png')}>
                    <Text style={styles.addButtonText} >
                        Додати замовлення
                    </Text>
                </ImageBackground>
            </TouchableOpacity>
        </AnimatedWrapper>
    )
}


