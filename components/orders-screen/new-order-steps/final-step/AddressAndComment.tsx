import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import AnimatedWrapper from "../../../animation/AnimatedWrapper";
import { Fonts } from "../../../../theme/fonts";
import { Colors } from "../../../../theme/colors";
import { fetchAddressList, IAddress, IAddressValuesPrivat, IAddressValuesNP } from "../../../../lib/api/orders-screen/address";
import { getDataFromAcyncStorage } from "../../../../lib/async-storage/acyncStorage";
import { ASYNC_STORAGE_USER_LOGIN } from "../../../../lib/async-storage/asyncStorageKeys";
import { ICreateOrderParams, useCreateOrder } from "../../NewOrderProvider";
import { formatAddressNP, formatAddressPrivat } from "../../../../lib/utils";
import { formStyles } from "../third-step-components/form-styles";
import { ArrowDown } from "../../../ui/ArrowDown";

function AddressAndComment({
    isAddressOpen,
    setIsAddressOpen
}: {
    isAddressOpen: boolean;
    setIsAddressOpen: (state: boolean) => void;
}) {
    const { orderParams, setOrderParams } = useCreateOrder();

    const [addressList, setAddressList] = useState<IAddress | null>(null);

    useEffect(() => {
        async function getAddressList() {
            const login = await getDataFromAcyncStorage(ASYNC_STORAGE_USER_LOGIN);
            if (!login) return;

            const list = await fetchAddressList(login);
            if (!list) return;

            setAddressList(list);

            const mainAddress = list["основний"];

            const addressValue = mainAddress ? formatAddressNP(mainAddress) : "адреса не вказана";
            const retailData = mainAddress ? mainAddress["фамилия"] + " " + mainAddress["имя"] + " " + mainAddress["отчество"] + ", " + mainAddress["тел.получателя"]
                :
                "дані користувача не вказані";

            setOrderParams({
                ...orderParams,
                newOrderObject: {
                    ...orderParams.newOrderObject,
                    adrType: "основний",
                    delivery_adr: addressValue,
                    retailData: retailData
                },
                ordersList: orderParams.ordersList.map((order) => ({
                    ...order,
                    adrType: "основний",
                    delivery_adr: addressValue,
                    retailData: retailData
                }))
            });
        }

        getAddressList();
    }, []);

    return (
        <AnimatedWrapper
            useOpacity
            offsetY={20}
            delay={500}
        >
            <View
                style={[
                    styles.addressContainer,
                    {
                        height: isAddressOpen ? 'auto' : 58,
                        minWidth: "100%",
                    }
                ]}
            >
                <Pressable onPress={() => setIsAddressOpen(true)}>
                    {!isAddressOpen && (
                        <>
                            <Text style={styles.addressPreview}>
                                🚚 Доставка: {' '}
                                <Text style={styles.addressText}>
                                    {orderParams.newOrderObject.adrType}
                                </Text>
                            </Text>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.addressPreview}>
                                📝 Коментарій: {' '}
                                <Text style={styles.addressText}>
                                    {orderParams.newOrderObject.comment.length === 0 ?
                                        'відсутній'
                                        :
                                        truncateText(orderParams.newOrderObject.comment, 10)
                                    }
                                </Text>
                            </Text>
                            <Image
                                source={require('../../../../assets/orders-screen/touch.webp')}
                                style={styles.touch}
                            />
                        </>
                    )}

                    {isAddressOpen && (
                        <View>
                            <Pressable
                                style={styles.closeBtn}
                                onPress={() => setIsAddressOpen(false)}
                            >
                                <Image
                                    source={require("../../../../assets/orders-screen/close.webp")}
                                    style={styles.closeIcon}
                                />
                            </Pressable>

                            <Address
                                addressList={addressList}
                                orderParams={orderParams}
                                setOrderParams={setOrderParams}
                            />

                            <Comment
                                orderParams={orderParams}
                                setOrderParams={setOrderParams}
                            />
                        </View>
                    )}
                </Pressable>
            </View>
        </AnimatedWrapper>
    );
}

export default AddressAndComment;

// 

function Address({ addressList, orderParams, setOrderParams }: { addressList: IAddress | null, orderParams: ICreateOrderParams, setOrderParams: (params: ICreateOrderParams) => void }) {
    const [listIsOpen, setListIsOpen] = useState<boolean>(false);
    const [selectedKey, setSelectedKey] = useState<keyof IAddress>("основний");
    const [addressValue, setAddressValue] = useState<string>(orderParams.newOrderObject.delivery_adr);

    useEffect(() => {
        setSelectedKey(orderParams.newOrderObject.adrType as keyof IAddress);
    }, []);

    const deliveryOptions = addressList
        ? [
            { key: "основний", label: "Основний", value: addressList["основний"] },
            { key: "додатковий", label: "Додатковий", value: addressList["додатковий"] },
            { key: "довільний", label: "Довільний", value: addressList["довільний"] },
            { key: "За адресою", label: "За адресою", value: addressList["За адресою"] }
        ]
        : [];

    const handleSelect = (optionKey: keyof IAddress) => {
        setSelectedKey(optionKey);

        const val = addressList?.[optionKey];
        if (val && typeof val === "object") {
            if (optionKey === 'основний') {
                const value = formatAddressNP(val as IAddressValuesNP);

                setAddressValue(value);
                setOrderParams({
                    ...orderParams,
                    newOrderObject: {
                        ...orderParams.newOrderObject,
                        adrType: "основний",
                        delivery_adr: value,
                    },
                    ordersList: orderParams.ordersList.map((order) => ({
                        ...order,
                        adrType: "основний",
                        delivery_adr: value,
                    }))
                });
            } else if (optionKey === 'За адресою') {
                const value = formatAddressPrivat(val as IAddressValuesPrivat);
                setAddressValue(value);
                setOrderParams({
                    ...orderParams,
                    newOrderObject: {
                        ...orderParams.newOrderObject,
                        adrType: "За адресою",
                        delivery_adr: value,
                    },
                    ordersList: orderParams.ordersList.map((order) => ({
                        ...order,
                        adrType: "За адресою",
                        delivery_adr: value,
                    }))
                });
            } else if (optionKey === 'довільний') {
                setAddressValue(val.город);
                setOrderParams({
                    ...orderParams,
                    newOrderObject: {
                        ...orderParams.newOrderObject,
                        adrType: "довільний",
                        delivery_adr: val.город,
                    },
                    ordersList: orderParams.ordersList.map((order) => ({
                        ...order,
                        adrType: "довільний",
                        delivery_adr: val.город,
                    }))
                });
            } else if (optionKey === 'додатковий') {
                setAddressValue(val.город);
                setOrderParams({
                    ...orderParams,
                    newOrderObject: {
                        ...orderParams.newOrderObject,
                        adrType: "додатковий",
                        delivery_adr: val.город,
                    },
                    ordersList: orderParams.ordersList.map((order) => ({
                        ...order,
                        adrType: "додатковий",
                        delivery_adr: val.город,
                    }))
                });
            }
        } else {
            setAddressValue("адреса не вказана");
        }

        setListIsOpen(false);
    };

    return (
        <>
            <AnimatedWrapper useOpacity offsetY={20}>
                <Text style={styles.label}>🚚 Адреса:</Text>
            </AnimatedWrapper>

            <AnimatedWrapper
                useOpacity offsetY={20} delay={100}
            >
                <Pressable onPress={() => setListIsOpen(!listIsOpen)}>
                    <Text style={[
                        formStyles.selectField,
                        { borderColor: listIsOpen ? Colors.blue : Colors.blueLight },
                    ]}>
                        {deliveryOptions.find(opt => opt.key === selectedKey)?.label}
                    </Text>
                </Pressable>
                <ArrowDown isRotate={listIsOpen} style={formStyles.arrowIcon} />
            </AnimatedWrapper>

            {listIsOpen && (
                <AnimatedWrapper
                    useOpacity
                    useScale
                    offsetY={-20}
                    style={{
                        minHeight: 50,
                        maxHeight: 321,
                        width: "100%",
                        backgroundColor: "white",
                        borderRadius: 17,
                        position: "absolute",
                        top: 87,
                        zIndex: 50,
                        padding: 8,
                        paddingBottom: 4,

                        // iOS shadow
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,

                        // Android shadow
                        elevation: 5,
                    }}
                >
                    <ScrollView style={formStyles.scrollModal}>
                        {deliveryOptions.map((option, index) => (
                            <AnimatedWrapper
                                key={option.key}
                                useOpacity
                                offsetY={10}
                                delay={150 + (30 * index)}
                            >
                                <Pressable
                                    style={[
                                        formStyles.productItem,
                                        selectedKey === option.key && { backgroundColor: Colors.pale },
                                    ]}
                                    onPress={() => handleSelect(option.key as keyof IAddress)}
                                >
                                    <Text style={formStyles.productItemText}>
                                        {option.label}
                                    </Text>
                                </Pressable>
                            </AnimatedWrapper>
                        ))}
                    </ScrollView>
                </AnimatedWrapper>
            )}

            <AnimatedWrapper useOpacity offsetY={20} delay={150}>
                <Text style={[styles.textArea, {
                    opacity: addressValue === "адреса не вказана" ? 0.4 : 1,
                }]}>{addressValue}</Text>
            </AnimatedWrapper>
        </>
    )
}

function Comment({ orderParams, setOrderParams }: { orderParams: ICreateOrderParams, setOrderParams: (params: ICreateOrderParams) => void }) {
    return (
        <View>
            <AnimatedWrapper useOpacity offsetY={20} delay={200}>
                <Text style={[styles.label, { marginTop: 20 }]}>📝 Коментарій до замовлення:</Text>
            </AnimatedWrapper>

            <AnimatedWrapper useOpacity offsetY={20} delay={250}>
                <TextInput
                    style={styles.textArea}
                    multiline
                    textAlign="left"
                    textAlignVertical="top"
                    placeholder="Введіть коментарій"
                    placeholderTextColor={Colors.gray}
                    value={orderParams.newOrderObject.comment}
                    onChangeText={(text) => {
                        setOrderParams({
                            ...orderParams,
                            newOrderObject: {
                                ...orderParams.newOrderObject,
                                comment: text
                            }
                        })
                    }}
                />
            </AnimatedWrapper>
        </View>
    )
}

// utils
function truncateText(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) {
        return text;
    }
    return text.slice(0, maxLength) + "...";
}

const styles = StyleSheet.create({
    // address and comment
    addressContainer: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 5
    },
    addressPreview: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 15,
        lineHeight: 20,
        marginBottom: 5,
        color: Colors.gray,
    },
    addressText: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 14,
        color: "black"
    },
    closeBtn: {
        width: 30,
        height: 30,
        backgroundColor: Colors.pale,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 1
    },
    closeIcon: {
        width: "70%",
        height: "70%",
        resizeMode: "contain"
    },
    label: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 16,
        color: "black",
        marginBottom: 10,
        marginLeft: 10,
    },
    textArea: {
        minHeight: 130,
        backgroundColor: Colors.pale,
        borderRadius: 12,
        padding: 10,
        fontFamily: Fonts.openSans400,
        fontSize: 14,
        color: 'black',
        marginTop: 10
    },
    commentArea: {
        height: 60,
        marginTop: 10
    },
    touch: {
        width: 25,
        height: 25,
        position: 'absolute',
        top: 0,
        right: 0,
        opacity: 0.5
    }
})
