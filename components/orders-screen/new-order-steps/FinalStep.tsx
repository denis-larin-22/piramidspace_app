import {
    Image,
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";
import { ICreateOrderParams, useCreateOrder } from "../NewOrderProvider";
import OrderItem from "./final-step/OrderItem";
import { useEffect, useState } from "react";
import { calculateOrderPriceDayNight, ICalculateOrderItem, ICalculateOrderObject, ICalculateResponce } from "../../../lib/api/orders-screen/calculate-order";
import AddressAndComment from "./final-step/AddressAndComment";
import { thirdStepStyles } from "./ThirdStep";
import { getDataFromAcyncStorage } from "../../../lib/async-storage/acyncStorage";
import { ASYNC_STORAGE_USER_LOGIN } from "../../../lib/async-storage/asyncStorageKeys";
import { MainGroupsCode } from "../../../lib/api/orders-screen/groups-and-products";
import Loader from "../../ui/Loader";

interface IOrderCalculates {
    isLoading: boolean,
    result: ICalculateResponce | null
}

function FinalStep({
    rateValue,
    balanceValue,
    stepHandler,
    closeHandler
}: {
    rateValue: string | null,
    balanceValue: number | null,
    stepHandler: () => void,
    closeHandler: () => void
}) {
    const { orderParams, setOrderParams } = useCreateOrder();
    const [isAddressOpen, setIsAddressOpen] = useState<boolean>(false);

    const initReport = {
        isVissible: false,
        isError: false,
        message: ""
    };
    const [report, setReport] = useState(initReport);

    const orderCalculatesInit: IOrderCalculates = {
        isLoading: false,
        result: null
    };
    const [orderCalculates, setOrderrCalculates] = useState<IOrderCalculates>(orderCalculatesInit);

    // Getting first calculates
    useEffect(() => {
        async function getCalculates() {
            setOrderrCalculates({
                isLoading: true,
                result: null
            });

            const calculates = await calculateCreateHandler(orderParams, false);
            if (calculates === null) {
                setReport({
                    isVissible: false,
                    isError: true,
                    message: ""
                });
                setTimeout(() => { setReport(initReport) }, 3500);
            };

            setOrderrCalculates({
                isLoading: false,
                result: calculates
            });
        };

        getCalculates();
    }, [orderParams.ordersList]);

    // Delete item from order
    async function deleteItemHandler(itemId: string) {
        const updatedList = orderParams.ordersList.filter((item) => item.id !== itemId);

        if (updatedList.length === 0) {
            closeHandler();
            return;
        }

        const updatedParams = {
            ...orderParams,
            ordersList: updatedList
        }

        // update params
        setOrderParams(updatedParams);
        // repeat calculates
        setOrderrCalculates({
            isLoading: true,
            result: null
        });

        const calculates = await calculateCreateHandler(updatedParams, false);

        if (calculates === null) {
            setReport({
                isVissible: false,
                isError: true,
                message: ""
            });
            setTimeout(() => { setReport(initReport) }, 3500);
        };

        setOrderrCalculates({
            isLoading: false,
            result: calculates
        });
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
                    <Text style={styles.subtitle}>
                        {orderParams.ordersList[0]?.group?.name || ""}
                    </Text>
                </View>
            </AnimatedWrapper>

            <AnimatedWrapper
                useOpacity
                offsetY={20}
                style={[styles.orderHeader, {
                    flexWrap: "wrap",
                    gap: 10,
                    alignItems: "center",
                    justifyContent: "center"
                }]}
            >
                <Text style={{ fontFamily: Fonts.comfortaa700, color: Colors.gray }}>Курс: {rateValue}</Text>
                <Text style={{ fontFamily: Fonts.comfortaa700, color: Colors.gray }}>Баланс: {balanceValue}</Text>
                <Text style={{ fontFamily: Fonts.comfortaa700, color: Colors.gray }}>Готовність на: -</Text>
            </AnimatedWrapper>

            <ScrollView
                style={{ maxHeight: isAddressOpen ? 0 : 370 }}
                contentContainerStyle={{ paddingVertical: 8 }}
                showsVerticalScrollIndicator={true}
            >
                {orderParams.ordersList.map((itemOrder, index) => {
                    const usdPrice = orderCalculates.result?.items.find((item) => item.product_code === itemOrder.product?.name)?.total_price;

                    return (
                        <OrderItem
                            key={itemOrder.id}
                            index={index}
                            orderObject={itemOrder}
                            isLoading={orderCalculates.isLoading}
                            usdPrice={usdPrice}
                            isError={report.isError}
                            deleteHandler={deleteItemHandler}
                        />
                    )
                })}
            </ScrollView>

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 10,
                    width: "100%",
                    gap: 30,
                }}
            >
                {!isAddressOpen && (
                    <Pressable onPress={stepHandler} style={styles.addButton}>
                        <Text style={styles.addButtonText}>+</Text>
                    </Pressable>
                )}

                <AddressAndComment
                    isAddressOpen={isAddressOpen}
                    setIsAddressOpen={setIsAddressOpen}
                />
            </View>

            <AnimatedWrapper useOpacity offsetY={20} delay={400} style={styles.totalRow}>
                <Text style={styles.totalAmount}>💰 Сума</Text>
                {orderCalculates ?
                    <Text style={styles.totalAmountText}>{orderCalculates.result?.total_usd.toFixed(2)}$</Text>
                    :
                    <Loader />
                }
            </AnimatedWrapper>

            <AnimatedWrapper
                style={[thirdStepStyles.submitButton, { bottom: -90 }]}
                offsetY={-20}
            >
                <Pressable
                    onPress={async () => {
                        const placeOrder = await calculateCreateHandler(orderParams, true);

                        if (placeOrder === null) {
                            setReport({
                                isVissible: true,
                                isError: true,
                                message: "Помилка створення/розрахунку замовлення"
                            });
                            setTimeout(() => { setReport(initReport) }, 3500);
                        } else {
                            setReport({
                                isVissible: true,
                                isError: false,
                                message: `Замовлення №${placeOrder.order_number} створено`
                            });
                            setTimeout(() => {
                                setReport(initReport);
                                closeHandler();
                            }, 3500);
                        }
                    }}
                >
                    <ImageBackground
                        source={require("../../../assets/gradient-small.png")}
                        style={thirdStepStyles.submitButtonBg}
                    >
                        <Text style={thirdStepStyles.submitButtonText}>Створити</Text>
                    </ImageBackground>
                </Pressable>
            </AnimatedWrapper>

            <Report
                isVissible={report.isVissible}
                isError={report.isError}
                message={report.message}
            />
        </View >
    );
}

export default FinalStep;


export async function calculateCreateHandler(orderParams: ICreateOrderParams, createOrder: boolean = false): Promise<ICalculateResponce | null> {
    const login = await getDataFromAcyncStorage(ASYNC_STORAGE_USER_LOGIN);

    const orderItems: ICalculateOrderItem[] = orderParams.ordersList.map((item) => {
        return {
            group_code: item.group.code as MainGroupsCode,
            subgroup_code: item.subgroup ? item.subgroup.code : "",
            product_code: item.product ? item.product.name : "",
            width: item.width_gab ? +item.width_gab : 0,
            height: item.height_gab ? +item.height_gab : 0,
            side: (item.controlType === "L") ? "left" : 'right',
            units: 'см',
            quantity: item.count_number ? +item.count_number : 0,
            system_color: item.color_system ? item.color_system : "",
            fixation_type: item.fixation_type ? item.fixation_type.name : "",
            options: item.options ? item.options : ""
        }
    });

    const requestParams: ICalculateOrderObject = {
        login: login || "",
        place_order: createOrder,
        items: orderItems,
        comment: orderParams.newOrderObject.comment,
        adrType: orderParams.newOrderObject.adrType,
        delivery_adr: orderParams.newOrderObject.delivery_adr,
        product_type: "жалюзи",
        retailData: orderParams.newOrderObject.retailData,
        predopl: 0
    }

    const calculatesResult = await calculateOrderPriceDayNight(requestParams);
    return calculatesResult;
}

// Report 
function Report({ isVissible, message, isError = false }: { isVissible: boolean, message: string, isError?: boolean }) {
    if (isVissible) {
        return (
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    zIndex: 100,
                    backgroundColor: Colors.pale,
                    justifyContent: 'center',
                }}
            >
                <AnimatedWrapper
                    useOpacity
                    useScale
                    style={{
                    }}
                >
                    {isError ?
                        <Image
                            source={require("../../../assets/orders-screen/error.webp")}
                            style={{
                                width: 70,
                                height: 70,
                                alignSelf: "center",
                                resizeMode: "contain",
                                alignItems: "center",
                            }}
                        />
                        :
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
                    }

                    <View style={{
                        marginVertical: 30,
                        width: '70%',
                        alignSelf: 'center',
                        height: 16,
                        backgroundColor: isError ? Colors.red : Colors.green,
                        borderRadius: 20,
                        borderWidth: 7,
                        borderColor: isError ? "#FF0A0A50" : "#1EBF9150",
                    }}></View>

                    <Text style={{
                        fontFamily: Fonts.comfortaa600,
                        fontSize: 16,
                        textAlign: 'center',
                        marginTop: 20,
                        color: Colors.gray
                    }}>{message}</Text>
                    {!isError && <Text style={{
                        fontFamily: Fonts.comfortaa600,
                        fontSize: 18,
                        textAlign: 'center',
                        opacity: 0.9
                    }}>Дякуємо за Ваше замовлення!</Text>}
                </AnimatedWrapper>
            </View>
        )
    } else return null;
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
        // marginLeft: 20,
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
        height: 28,
        fontFamily: Fonts.comfortaa700,
        fontSize: 18,
        lineHeight: 26,
        color: Colors.gray
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
    button: {
        height: 59,
        borderRadius: 50,
        overflow: 'hidden',
    },
    createButton: {
        position: 'absolute',
        bottom: -90,
        alignSelf: 'center'
    },
    buttonBg: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    createButtonText: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 18,
        lineHeight: 50,
        color: 'white',
        paddingHorizontal: 20,
    },
});
