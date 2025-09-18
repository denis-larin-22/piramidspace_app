import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";
import { useCreateOrder } from "../NewOrderProvider";
import OrderItem from "./final-step/OrderItem";

function FinalStep({ stepHandler, closeHandler }: { stepHandler: () => void, closeHandler: () => void }) {
    const { orderParams, setOrderParams } = useCreateOrder();

    const deleteItemHandler = (itemId: string) => {
        const updatedList = orderParams.ordersList.filter((order) => order.id !== itemId);
        setOrderParams({
            ...orderParams,
            ordersList: updatedList
        });

        if (updatedList.length === 0) {
            closeHandler();
        }
    }

    return (
        <View>
            <AnimatedWrapper useOpacity offsetY={20} style={styles.orderHeader}>
                <Image
                    source={require("../../../assets/orders-screen/cart.webp")}
                    style={styles.cartIcon}
                />
                <View>
                    <Text style={styles.title}>Нове замовлення</Text>
                    <Text style={styles.subtitle}>{orderParams.ordersList[0].group.name}</Text>
                </View>
            </AnimatedWrapper>

            <ScrollView
                style={{ maxHeight: 450 }}
                contentContainerStyle={{ paddingVertical: 8 }}
                showsVerticalScrollIndicator={true} // можно убрать, если не нужно
            >
                {orderParams.ordersList.map((itemOrder, index) => (
                    <OrderItem
                        key={index}
                        index={index}
                        orderObject={itemOrder}
                        deleteHandler={deleteItemHandler}
                    />
                ))}
            </ScrollView>

            <Pressable onPress={stepHandler} style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
            </Pressable>

            <AnimatedWrapper
                useOpacity
                offsetY={20}
                delay={400}
                style={styles.totalRow}
            >
                <Text style={styles.totalAmount}>💰 Загальна сума</Text>
                <Text style={styles.totalAmountText}>{ } грн</Text>
            </AnimatedWrapper>
        </View>
    );
}

export default FinalStep;

// Report 
function Report() {
    return (
        <AnimatedWrapper
            useOpacity
            useScale
        >
            <Image
                source={require("../../../assets/orders-screen/success.webp")}
                style={{
                    width: 70,
                    height: 70,
                    alignSelf: "center",
                    resizeMode: "contain",
                    alignItems: "center",
                }}
            />
            <Text style={{
                fontFamily: Fonts.comfortaa600,
                fontSize: 18,
                textAlign: 'center',
                marginTop: 20,
                opacity: 0.9
            }}>Дякуємо за Ваше замовлення!</Text>
        </AnimatedWrapper>
    )
}

const styles = StyleSheet.create({
    orderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingBottom: 8,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderColor: "#A2A2A870",
    },
    cartIcon: {
        width: 70,
        height: 70,
        alignSelf: "center",
        resizeMode: "contain",
        alignItems: "center",
        borderRadius: 50
    },
    title: {
        fontSize: 16,
        fontFamily: Fonts.comfortaa600,
        textAlign: "center",
        textTransform: "uppercase",
        color: Colors.gray,
    },
    subtitle: {
        fontSize: 24,
        fontFamily: Fonts.comfortaa700,
        color: Colors.blue,
        textAlign: "center",
        textTransform: "uppercase",
    },
    addButton: {
        marginTop: 5,
        marginBottom: 10,
        backgroundColor: Colors.blue,
        width: 35,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        alignSelf: 'center'
    },
    addButtonText: {
        color: 'white',
        fontFamily: Fonts.comfortaa700,
        fontSize: 24,
        top: -4,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 12
    },
    totalAmount: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 18,
        lineHeight: 26,
        color: Colors.gray,
    },
    totalAmountText: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 18,
        lineHeight: 26,
    },
    submitButton: {
        height: 59,
        maxWidth: 180,
        width: "100%",
        borderRadius: 31,
        overflow: "hidden",
        position: "absolute",
        bottom: -70,
        alignSelf: "center",
    },
    submitButtonBg: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    submitButtonText: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 17,
        lineHeight: 22,
        color: "white",
    },
    mt20: {
        marginTop: 20,
    },
});
