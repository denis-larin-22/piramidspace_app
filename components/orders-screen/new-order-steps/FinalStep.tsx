import React, { useState } from "react";
import {
    Image,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { INewOrderObject } from "../AddNewOrder";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";

interface IProps {
    orderObject: INewOrderObject;
};


function FinalStep({ orderObject }: IProps) {
    const [isSent, setIsSent] = useState<boolean>(false);

    return (
        <>
            {
                isSent ?
                    <Report />
                    :
                    <FinalOrderInfo orderObject={orderObject} />
            }

            <AnimatedWrapper style={styles.submitButton} offsetY={-20}>
                <Pressable onPress={() => { setIsSent(true) }}>
                    <ImageBackground
                        source={require("../../../assets/gradient-small.png")}
                        style={styles.submitButtonBg}
                    >
                        <Text style={styles.submitButtonText}>Створити</Text>
                    </ImageBackground>
                </Pressable>
            </AnimatedWrapper>
        </>
    );
};

export default FinalStep;


function FinalOrderInfo({ orderObject }: { orderObject: INewOrderObject }) {
    const rows = [
        { label: "Група", value: orderObject.group.name },
        { label: "Підгрупа", value: orderObject.subgroup.name },
        { label: "Продукт", value: orderObject.product?.name || "Не обрано" },
        { label: "Код товару", value: orderObject.product?.code || "Не обрано", dashedBorder: true },

        { label: "Ширина (габарит)", value: orderObject.width_gab },
        { label: "Ширина (по штапику)", value: orderObject.width_shtapik },
        { label: "Висота (габарит)", value: orderObject.height_gab },
        { label: "Висота (по штапику)", value: orderObject.height_shtapik, dashedBorder: true },

        { label: "⚙ Тип управління", value: orderObject.typeManagment || "Не обрано" },
        { label: "🔧 Тип фіксації", value: orderObject.fixation_type?.name || "Не обрано" },
        { label: "🎨 Колір системи", value: orderObject.color_system },
        { label: "🔢 Кількість", value: `${orderObject.count_number} шт.`, dashedBorder: true },

        { label: "💰 Ціна за одиницю", value: `${orderObject.price} грн`, dashedBorder: true },
    ];

    return (
        <>
            <View>
                <AnimatedWrapper useOpacity offsetY={20}>
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
                    <Text style={styles.title}>Нове замовлення</Text>
                    <Text style={styles.subtitle}>{orderObject.group.name}</Text>
                </AnimatedWrapper>

                {rows.map(({ label, value, dashedBorder }, index) => (
                    <RowItem key={index} label={label} value={value} dashedBorder={dashedBorder} index={index} />
                ))}

                <AnimatedWrapper useOpacity offsetY={20} delay={400} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={styles.totalAmount}>💰 Загальна сума</Text>
                    <Text style={styles.totalAmountText}>{orderObject.final_price} грн</Text>
                </AnimatedWrapper>
            </View>
        </>
    );
}

const RowItem: React.FC<{
    label: string;
    value: React.ReactNode;
    dashedBorder?: boolean;
    index: number
}> = ({ label, value, dashedBorder, index }) => (
    <AnimatedWrapper
        useOpacity
        offsetY={20}
        delay={index * 20}
        style={[{
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        dashedBorder && {
            marginBottom: 10,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderStyle: 'dashed',
            borderColor: '#A2A2A870'
        }]}>
        <Text style={styles.section}>{label}</Text>
        <Text style={styles.detail}>{value}</Text>
    </AnimatedWrapper>
);

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
        paddingBottom: 15,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderColor: "#A2A2A870",
    },
    section: {
        fontSize: 15,
        fontFamily: Fonts.comfortaa600,
        color: "#707070",
    },
    detail: {
        fontSize: 15,
        fontFamily: Fonts.comfortaa600,
        maxWidth: '60%'
    },
    totalAmount: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 20,
        color: "#707070",
    },
    totalAmountText: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 20,
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
