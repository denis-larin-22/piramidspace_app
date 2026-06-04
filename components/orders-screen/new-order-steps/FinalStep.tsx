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
import { getDataFromAcyncStorage } from "../../../lib/async-storage/acyncStorage";
import { ASYNC_STORAGE_RATE_VALUE_KEY, ASYNC_STORAGE_USER_INFO_OBJECT } from "../../../lib/async-storage/asyncStorageKeys";
import { MainGroupsCode } from "../../../lib/api/orders-screen/groups-and-products";
import Loader from "../../ui/Loader";
import { formStyles } from "./third-step-components/form-styles";
import { IUserInfo } from "../../../lib/api/auth";
import { ErrorMessage } from "../../ui/ErrorMessage";
import { shadow } from "../../../theme/shadow";
import RetailOrderButton from "./fourth-step/RetailOrderButton";
import RetailOrderEditButton from "./fourth-step/RetailOrderEditButton";

export interface IOrderCalculates {
    isLoading: boolean,
    result: ICalculateResponce | null | undefined
}

function FinalStep({
    rateValue,
    balanceValue,
    addItemToOrder,
    stepHandler,
    retailEditBtnHandler,
    closeHandler,
}: {
    rateValue: string | null,
    balanceValue: number | null,
    addItemToOrder: () => void,
    stepHandler: () => void,
    retailEditBtnHandler: () => void,
    closeHandler: () => void,
}) {
    const { orderParams, setOrderParams } = useCreateOrder();
    const [isAddressOpen, setIsAddressOpen] = useState<boolean>(false);
    const isComponentsGroup = orderParams.activeGroup === "components";

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

    // 1$ check
    const [oneDollarCheck, setOneDollarCheck] = useState(true);
    const [isOneDollarCheckError, setIsOneDollarCheckError] = useState(false);

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

                setTimeout(() => {
                    setReport(initReport);
                    setOrderrCalculates({
                        isLoading: false,
                        result: undefined
                    });
                }, 3500);
            } else {
                const resultSumm = Number(calculates.total_uah);
                const dollarValue = rateValue ? Number(rateValue) : 0;

                if (resultSumm > dollarValue) {
                    setOneDollarCheck(true);
                } else {
                    setOneDollarCheck(false);
                }

                setOrderrCalculates({
                    isLoading: false,
                    result: calculates
                });
            }
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
            {orderCalculates.result === undefined && <RessponceErrorMessage />}

            <AnimatedWrapper
                useOpacity
                offsetY={20}
                style={styles.orderHeader}
            >
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
                delay={200}
                style={styles.rateBalanceContainer}
            >
                <View style={styles.rateBalanceContainerText}>
                    <View style={styles.alignCenter}>
                        <Text style={styles.rateBalanceTitle}>Курс:</Text>
                        <Text style={[styles.rateBalanceText, { color: 'black' }]}>{rateValue}</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.alignCenter}>
                        <Text style={styles.rateBalanceTitle}>Баланс:</Text>
                        <Text style={[styles.rateBalanceText, { color: (Number(balanceValue) > 0) ? "black" : Colors.redLight }]}>{balanceValue}</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.alignCenter}>
                        <Text style={styles.rateBalanceTitle}>Готовність на:</Text>
                        <Text style={[styles.rateBalanceText, { color: 'black' }]}>-</Text>
                    </View>
                </View>

                {/* Retail mode */}
                <View style={styles.retailButtonsContainer}>
                    <RetailOrderButton
                        style={{
                            width: '95%',
                        }}
                    />
                    <RetailOrderEditButton
                        btnHandler={retailEditBtnHandler}
                    />
                </View>

            </AnimatedWrapper>

            <AnimatedWrapper
                useOpacity
                offsetY={20}
                delay={300}
                style={styles.sckrollContainer}
            >
                <ScrollView
                    style={isAddressOpen ? styles.scrollViewHidden : styles.scrollViewVisible}
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={true}
                >
                    {orderParams.ordersList.map((itemOrder, index) => {
                        const price = orderCalculates.result?.items.find((item) => item.product_code === itemOrder.product?.name)?.total_price_uah;
                        const priceFixation = orderCalculates.result?.items.find((item) => item.product_code === itemOrder.product?.name)?.fixationMarkup_uah;
                        return (
                            <OrderItem
                                key={itemOrder.id}
                                index={index}
                                orderObject={itemOrder}
                                isLoading={orderCalculates.isLoading}
                                price={price}
                                priceFixation={priceFixation}
                                isError={report.isError}
                                deleteHandler={deleteItemHandler}
                            />
                        )
                    })}
                </ScrollView>
            </AnimatedWrapper>

            <View style={styles.addressAndAddButtonContainer}>
                {!isAddressOpen && (
                    <AnimatedWrapper
                        useOpacity
                        offsetY={20}
                        delay={400}
                        style={styles.addWrap}
                    >
                        <Text style={styles.addSumm}>в корзині: {orderParams.ordersList.length}</Text>

                        <Pressable onPress={addItemToOrder} style={[styles.addButton, shadow]}>
                            <ImageBackground
                                source={require("../../../assets/gradient-small.png")}
                                style={styles.addButtonBcg}
                            >
                                <Text style={styles.addButtonPlus}>+</Text>
                                <Text style={styles.addButtonText}>Додати ще</Text>
                            </ImageBackground>
                        </Pressable>
                    </AnimatedWrapper>
                )}

                <AddressAndComment
                    isAddressOpen={isAddressOpen}
                    setIsAddressOpen={setIsAddressOpen}
                />
            </View>

            <AnimatedWrapper useOpacity offsetY={20} delay={600} style={styles.totalRow}>
                <Text style={styles.totalAmount}>Сума</Text>
                {orderCalculates.result ? (
                    <View style={styles.totalAmountRow}>
                        <Text style={styles.totalAmountText}>{orderCalculates.result.total_uah.toFixed(2)}</Text>
                        <Text style={styles.totalAmountLabel}>грн.</Text>
                    </View>
                ) : (
                    <Loader />
                )}

                {/* Components group price limit */}
            </AnimatedWrapper>
            {isComponentsGroup && <Text style={styles.compLimitsText}>Зверніть увагу, що сума замовлення має бути більше 1$</Text>}

            <AnimatedWrapper
                style={[formStyles.submitButton, styles.createButtonWrapper]}
                offsetY={-20}
            >
                <Pressable onPress={() => {
                    if (oneDollarCheck) {
                        stepHandler();
                    } else {
                        setIsOneDollarCheckError(true);
                        setTimeout(() => { setIsOneDollarCheckError(false) }, 2500)
                    }
                }}>
                    <ImageBackground
                        source={require("../../../assets/gradient-small.png")}
                        style={formStyles.submitButtonBg}
                    >
                        <Text style={formStyles.submitButtonText}>Сформувати</Text>
                    </ImageBackground>
                </Pressable>
            </AnimatedWrapper>

            {isOneDollarCheckError && <ErrorMessage
                errorTitle="Зверніть увагу"
                errorText="Для створення замовлення сума має бути більше 1$"
            />}

        </View>
    );
}

export default FinalStep;

export async function calculateCreateHandler(orderParams: ICreateOrderParams, createOrder: boolean = false): Promise<ICalculateResponce | null> {
    const userInfo = await getDataFromAcyncStorage(ASYNC_STORAGE_USER_INFO_OBJECT);
    if (!userInfo) return null;

    const { "логин": login } = JSON.parse(userInfo) as IUserInfo;

    const orderItems: ICalculateOrderItem[] = orderParams.ordersList.map((item) => {
        return {
            group_code: item.group.code as MainGroupsCode,
            subgroup_code: item.subgroup ? item.subgroup.code : "",
            product_code: item.product ? item.product.name : "",
            width: item.width_gab ? +item.width_gab : 0,
            height: item.height_gab ? +item.height_gab : 0,
            side: (item.controlType === "L" || item.controlType === "ліворуч") ? "left" : 'right',
            units: "см",
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
        product_type: orderParams.activeGroup as string,
        retailData: orderParams.newOrderObject.retailData,
        predopl: 0
    }

    const calculatesResult = await calculateOrderPriceDayNight(requestParams);
    return calculatesResult;
}



function RessponceErrorMessage() {
    return (
        <AnimatedWrapper
            offsetY={30}
            useOpacity
            delay={200}
            style={styles.resErrContainer}
        >
            <View style={styles.resErrRow}>
                <Text style={styles.resErrIcon}>❌</Text>
                <Text style={styles.resErrTitle}> Помилка розрахунку</Text>
            </View>
            <Text style={styles.resErrDescription}>
                Ми вже працюємо над усуненням проблеми
            </Text>
        </AnimatedWrapper>
    )
}

const styles = StyleSheet.create({
    orderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        paddingBottom: 18,
        backgroundColor: "#23DCC830",
        marginHorizontal: -10,
        marginTop: -10,
        paddingTop: 3,
        paddingLeft: 20,
        borderRadius: 12,
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
        fontSize: 14,
        lineHeight: 16,
        marginBottom: 5,
        fontFamily: Fonts.comfortaa700,
        textAlign: "left",
        textTransform: "uppercase",
        color: Colors.gray,
    },
    subtitle: {
        fontSize: 24,
        lineHeight: 26,
        fontFamily: Fonts.comfortaa700,
        color: Colors.blue,
        textAlign: "center",
        textTransform: "uppercase",
        maxWidth: 250,
    },
    rateBalanceContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginHorizontal: -10,
        paddingVertical: 4,
        marginTop: -10,
        marginBottom: 5,
    },
    rateBalanceContainerText: {
        flexDirection: 'row',
        flexWrap: "wrap",
        gap: 10,
        alignItems: "center",
        justifyContent: "space-evenly",
        marginBottom: 5
    },
    alignCenter: {
        alignItems: 'center'
    },
    rateBalanceText: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 15,
    },
    rateBalanceTitle: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 12,
        color: Colors.gray
    },
    separator: {
        width: 1,
        height: '70%',
        backgroundColor: Colors.grayLight,
    },
    retailButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    sckrollContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 7,
        borderRadius: 12,
        marginHorizontal: -10,
        overflow: 'hidden'
    },
    scrollViewVisible: {
        maxHeight: 320,
    },
    scrollViewHidden: {
        maxHeight: 0
    },
    scrollViewContent: {
        paddingVertical: 8
    },
    addressAndAddButtonContainer: {
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 5,
        width: "100%",
        gap: 7,
    },
    addWrap: {
        alignItems: 'center',
        gap: 3,
        width: '100%'
    },
    addSumm: {
        marginTop: 2,
        fontFamily: Fonts.comfortaa600,
        fontSize: 12,
        lineHeight: 14,
        color: Colors.gray,
    },
    addButton: {
        overflow: 'hidden',
        borderRadius: 50,
        width: '100%',
    },
    addButtonBcg: {
        flexDirection: 'row',
        gap: 15,
        backgroundColor: Colors.blue,
        paddingRight: 10,
        paddingLeft: 5,
        height: 35,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    addButtonText: {
        color: 'white',
        fontFamily: Fonts.comfortaa700,
        fontSize: 14,
        lineHeight: 16,
    },
    addButtonPlus: {
        height: 24,
        width: 24,
        backgroundColor: 'white',
        borderRadius: 50,
        color: "#1CBCD7",
        fontFamily: Fonts.comfortaa700,
        fontSize: 24,
        lineHeight: 26,
        textAlign: 'center'
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 12
    },
    totalAmountRow: {
        flexDirection: 'row',
        gap: 3
    },
    totalAmount: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 16,
        lineHeight: 18,
        color: Colors.gray
    },
    compLimitsText: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 12,
        lineHeight: 14,
        color: Colors.gray,
        textAlign: 'center'
    },
    totalAmountText: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 18,
        lineHeight: 20,
        color: 'black'
    },
    totalAmountLabel: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 16,
        lineHeight: 18,
        color: Colors.gray
    },
    createButtonWrapper: {
        bottom: -82,
        alignSelf: "center",
    },
    resErrContainer: {
        position: 'absolute',
        top: -80,
        zIndex: 100,
        backgroundColor: "#FF6B6B",
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 16,
        alignSelf: "center",
        width: '90%',
    },
    resErrRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    resErrIcon: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 14,
        color: 'white',
        height: 25,
        width: 25,
        backgroundColor: 'white',
        borderRadius: 100,
        paddingLeft: 4,
    },
    resErrTitle: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 14,
        color: 'white',
    },
    resErrDescription: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
    },
});