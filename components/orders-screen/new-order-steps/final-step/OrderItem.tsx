import { useEffect, useState } from "react";
import { INewOrderObject } from "../../NewOrderProvider";
import AnimatedWrapper from "../../../animation/AnimatedWrapper";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import { Fonts } from "../../../../theme/fonts";
import { Colors } from "../../../../theme/colors";
import Loader from "../../../ui/Loader";
import { ErrorMessage } from "../../../ui/ErrorMessage";

function OrderItem({
    index,
    orderObject,
    usdPrice,
    isLoading,
    isError = false,
    deleteHandler,
}: {
    index: number,
    orderObject: INewOrderObject,
    usdPrice: number | undefined,
    isLoading: boolean,
    isError?: boolean
    deleteHandler: (itemId: string) => void,
}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const isComponentsOrAdsGroup = orderObject.group.code === 'components' || orderObject.group.code === 'ads';

    const itemRows = [
        { label: "↔️ Ширина (габарит)", value: orderObject.width_gab },
        { label: "↕️ Висота (габарит)", value: orderObject.height_gab },
        { label: "↔️ Ширина (по штапику)", value: orderObject.width_shtapik },
        { label: "↕️ Висота (по штапику)", value: orderObject.height_shtapik, dashedBorder: true },

        {
            label: "⚙ Управління", value: isComponentsOrAdsGroup ? ""
                : orderObject.controlType === 'L' ? "ліворуч" : "праворуч"
        },
        { label: "🔧 Фіксація", value: orderObject.fixation_type?.name },
        { label: "🎨 Колір", value: orderObject.color_system },
        { label: "📋 Группа", value: isComponentsOrAdsGroup ? `${orderObject.subgroup.name}` : "" },
        { label: "🔢 Кількість", value: `${orderObject.count_number} шт.`, dashedBorder: true },


        {
            label: "Вартість", value: usdPrice ? usdPrice.toFixed(2) + "$" : "❌",
            dashedBorder: true
        },
    ];

    return (
        <AnimatedWrapper>
            <Pressable
                onPress={() => setIsOpen(!isOpen)}
                style={styles.container}
            >
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
                                    orderObject.subgroup.name
                                    :
                                    orderObject.width_gab + "x" + orderObject.height_gab
                                }
                            </Text>
                            <Text style={styles.previewBox}>
                                {orderObject.count_number} шт.
                            </Text>
                        </View>
                        <Text style={styles.previewBox}>
                            {orderObject.controlType} {"\n"}
                            {orderObject.color_system} {"\n"}
                            {orderObject.fixation_type?.name}
                        </Text>


                        {!isLoading ? <View style={styles.previewColumn}>
                            <Text style={styles.previewBox}>
                                {usdPrice ? usdPrice.toFixed(2) + "$" : "❌"}
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
        </AnimatedWrapper>
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
        marginBottom: 8
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
        fontFamily: Fonts.comfortaa700,
        fontSize: 16,
        lineHeight: 23,
        width: 25,
        height: 25,
        backgroundColor: Colors.blue,
        textAlign: 'center',
        verticalAlign: 'middle',
        color: 'white',
        borderRadius: 50,
        marginRight: 8
    },
    productName: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 15,
        color: 'black',
        lineHeight: 19,
        maxWidth: 240
    },
    deleteBtn: {
        width: 30,
        height: 30,
        backgroundColor: Colors.grayLight,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        position: 'absolute',
        right: 0,
        top: -5
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
        paddingBottom: 7,
        marginBottom: 5
    },
    previewColumn: {
        gap: 5
    },
    previewBox: {
        fontFamily: Fonts.openSans400,
        fontSize: 14,
        textAlign: 'center',
        borderRadius: 8,
        color: 'black',
        maxWidth: 120
    },
    expandedContainer: {
        backgroundColor: 'white',
        padding: 5,
        top: -20,
        borderRadius: 8,
        paddingBottom: 12
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
        fontFamily: Fonts.comfortaa600,
        color: "#707070",
    },
    rowValue: {
        fontSize: 15,
        fontFamily: Fonts.comfortaa600,
        color: 'black',
        maxWidth: '70%'
    },
    detailSwitcherText: {
        color: Colors.gray,
        fontFamily: Fonts.openSans400,
        fontSize: 16,
        marginLeft: 15,
        opacity: 0.6,
    },
    setailSwitcherArrow: {
        width: 10,
        height: 16,
        resizeMode: 'stretch',
        position: 'absolute',
        right: 20,
        top: 3
    }
});