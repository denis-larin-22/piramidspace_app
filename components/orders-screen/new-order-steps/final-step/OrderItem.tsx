import { useEffect, useState } from "react";
import { INewOrderObject } from "../../NewOrderProvider";
import AnimatedWrapper from "../../../animation/AnimatedWrapper";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import { Fonts } from "../../../../theme/fonts";
import { Colors } from "../../../../theme/colors";
import Loader from "../../../ui/Loader";
import { ErrorMessage } from "../../../ui/ErrorMessage";
import { ISubgroup } from "../../../../lib/api/orders-screen/groups-and-products";

function OrderItem({
    index,
    orderObject,
    price,
    priceFixation,
    isLoading,
    isError = false,
    deleteHandler,
}: {
    index: number,
    orderObject: INewOrderObject,
    price: number | undefined,
    priceFixation: number | undefined,
    isLoading: boolean,
    isError?: boolean
    deleteHandler: (itemId: string) => void,
}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const subgroup = orderObject.subgroup as ISubgroup;
    const isComponentsOrAdsGroup = orderObject.group.code === 'components' || orderObject.group.code === 'ads';

    const itemRows = [
        { label: "Ширина (габарит)", value: orderObject.width_gab },
        { label: "Висота (габарит)", value: orderObject.height_gab },
        { label: "Ширина (по штапику)", value: orderObject.width_shtapik },
        { label: "Висота (по штапику)", value: orderObject.height_shtapik, dashedBorder: true },

        {
            label: "Управління", value: isComponentsOrAdsGroup ? ""
                : orderObject.controlType === 'L' ? "ліворуч" : "праворуч"
        },
        { label: "Фіксація", value: orderObject.fixation_type?.name },
        { label: "Колір", value: orderObject.color_system },
        { label: "Группа", value: isComponentsOrAdsGroup ? `${subgroup.name}` : "" },
        { label: "Кількість", value: `${orderObject.count_number} шт.`, dashedBorder: true },


        { label: "Вартість Фіксації", value: priceFixation ? priceFixation.toFixed(2) + " грн." : "❌", },
        {
            label: "Вартість", value: price ? price.toFixed(2) + " грн." : "❌",
            dashedBorder: true
        },
    ];

    const paramsString = [
        orderObject.controlType,
        orderObject.color_system,
        orderObject.fixation_type?.name
    ].filter(Boolean).join('\n');

    return (
        <>
            <Pressable onPress={() => setIsOpen(!isOpen)} style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.indexCircle}>{++index}</Text>
                    <Text style={styles.productName}>{orderObject.product?.name}</Text>

                    <Pressable
                        style={styles.deleteBtn}
                        onPress={() => deleteHandler(orderObject.id as string)}
                    >
                        <Image
                            source={require("../../../../assets/orders-screen/delete.webp")}
                            style={styles.deleteIcon}
                            resizeMode="contain"
                        />
                    </Pressable>
                </View>

                {!isOpen ? (
                    <View style={styles.previewRow}>
                        <View style={styles.previewColumn}>
                            <Text style={styles.previewBox}>
                                {isComponentsOrAdsGroup ?
                                    subgroup.name
                                    :
                                    orderObject.width_gab + "x" + orderObject.height_gab
                                }
                            </Text>
                            <Text style={styles.previewBox}>
                                {orderObject.count_number} шт.
                            </Text>
                        </View>
                        <View style={styles.separator} />
                        <Text style={styles.previewBox}>
                            {paramsString}
                        </Text>
                        <View style={styles.separator} />
                        {!isLoading ? <View style={styles.previewColumn}>
                            <Text style={styles.previewBox}>
                                {price ? price.toFixed(2) + " грн." : "❌"}
                            </Text>
                        </View>
                            :
                            <Loader radius={40} />
                        }
                    </View>
                ) : null}

                {!isOpen && <DetailsSwitcher
                    isOpen={isOpen}
                    onSwitch={() => setIsOpen(!isOpen)}
                />}
            </Pressable>

            {isError && <ErrorMessage errorText="Помилка запиту розрахунку вартості!" />}
            {isOpen ? (
                <View style={styles.expandedContainer}>
                    {itemRows.map(({ label, value, dashedBorder }, index) => (
                        <RowItem
                            key={index}
                            label={label}
                            value={value}
                            dashedBorder={dashedBorder}
                            index={index}
                        />
                    ))}

                    {isOpen && <DetailsSwitcher
                        isOpen={isOpen}
                        onSwitch={() => setIsOpen(!isOpen)}
                    />}
                </View>
            ) : null}
        </>
    )
}

export default OrderItem;

// order rows
const RowItem: React.FC<{
    label: string;
    value: string | null | undefined;
    dashedBorder?: boolean;
    index: number
}> = ({ label, value, dashedBorder, index }) => {
    if (!value) return null;

    return (
        <AnimatedWrapper
            useOpacity
            offsetY={20}
            delay={index * 20}
            style={[
                styles.rowItem,
                dashedBorder && styles.rowItemDashed
            ]}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={[styles.rowValue, { textAlign: 'right' }]}>{value}</Text>
        </AnimatedWrapper>
    )
};

function DetailsSwitcher({ isOpen, onSwitch }: { isOpen: boolean, onSwitch: () => void }) {
    return (
        <Pressable
            onPress={onSwitch}
        >
            <Text style={styles.detailSwitcherText}>{isOpen ? "Приховати деталі" : "Деталі замовлення"}</Text>
            <Image
                source={require('../../../../assets/orders-screen/arrow.webp')}
                style={[styles.setailSwitcherArrow, {
                    transform: [{ rotate: isOpen ? "-90deg" : "90deg" }]
                }]}
            />
        </Pressable>
    )
};

// Styles
const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 4,
        borderWidth: 2,
        borderColor: Colors.grayLight
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 5,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderColor: Colors.grayLight
    },
    indexCircle: {
        fontFamily: Fonts.openSans700,
        fontSize: 16,
        lineHeight: 18,
        width: 25,
        height: 25,
        backgroundColor: Colors.blue,
        textAlign: 'center',
        verticalAlign: 'middle',
        color: 'white',
        borderRadius: 50,
        marginRight: 8,
        top: -5,
    },
    productName: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 15,
        lineHeight: 17,
        color: 'black',
        maxWidth: 240
    },
    deleteBtn: {
        width: 30,
        height: 30,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        position: 'absolute',
        right: 0,
        top: -5,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6,
    },
    deleteIcon: {
        width: 20,
        height: 20,
        opacity: 0.3
    },
    previewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderColor: Colors.grayLight,
        paddingBottom: 5,
    },
    previewColumn: {
        gap: 5
    },
    previewBox: {
        fontFamily: Fonts.openSans400,
        fontSize: 13,
        lineHeight: 15,
        textAlign: 'center',
        verticalAlign: 'middle',
        color: 'black',
        borderRadius: 8,
        maxWidth: 120
    },
    expandedContainer: {
        backgroundColor: 'white',
        padding: 5,
        top: -20,
        width: '100%',
        alignSelf: 'center',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        paddingBottom: 12,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: Colors.grayLight,
        gap: 6
    },
    rowItem: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rowItemDashed: {
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#A2A2A870'
    },
    rowLabel: {
        fontSize: 15,
        lineHeight: 17,
        fontFamily: Fonts.comfortaa600,
        color: "#707070",
    },
    rowValue: {
        fontSize: 15,
        lineHeight: 17,
        fontFamily: Fonts.comfortaa600,
        color: 'black',
        maxWidth: '70%'
    },
    detailSwitcherText: {
        color: Colors.blue,
        fontFamily: Fonts.comfortaa700,
        fontSize: 13,
        lineHeight: 15,
        marginLeft: 5,
        opacity: 0.6,
        paddingTop: 5
    },
    setailSwitcherArrow: {
        width: 10,
        height: 16,
        resizeMode: 'stretch',
        position: 'absolute',
        right: 30,
        top: 8,
        opacity: 0.7
    },
    separator: {
        width: 1,
        height: '70%',
        backgroundColor: Colors.grayLight,
    },
});