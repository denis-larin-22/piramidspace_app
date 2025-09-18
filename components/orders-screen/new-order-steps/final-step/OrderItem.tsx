import { useEffect, useState } from "react";
import { INewOrderObject } from "../../NewOrderProvider";
import AnimatedWrapper from "../../../animation/AnimatedWrapper";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import { Fonts } from "../../../../theme/fonts";
import { Colors } from "../../../../theme/colors";
import { calculateOrderPriceDayNight, ICalculateResponce, ICulculateOrderObject } from "../../../../lib/api/orders-screen/calculate-order";
import { MainGroupsCode } from "../../../../lib/api/orders-screen/groups-and-products";
import Loader from "../../../ui/Loader";
import { getDataFromAcyncStorage } from "../../../../lib/async-storage/acyncStorage";
import { ASYNC_STORAGE_USER_LOGIN } from "../../../../lib/async-storage/asyncStorageKeys";
import { ArrowDown, ErrorMessage } from "../ThirdStep";

function OrderItem({ index, orderObject, deleteHandler }: { index: number, orderObject: INewOrderObject, deleteHandler: (itemId: string) => void }) {
    const itemRows = [
        { label: "Група", value: orderObject.group.name },
        { label: "Підгрупа", value: orderObject.subgroup?.name },
        { label: "Назва товару", value: orderObject.product?.name, dashedBorder: true },

        { label: "↔️ Ширина (по штапику)", value: orderObject.width_shtapik },
        { label: "↔️ Ширина (габарит)", value: orderObject.width_gab },
        { label: "↕️ Висота (по штапику)", value: orderObject.height_shtapik },
        { label: "↕️ Висота (габарит)", value: orderObject.height_gab, dashedBorder: true },

        { label: "⚙ Тип управління", value: orderObject.controlType },
        { label: "🔧 Тип фіксації", value: orderObject.fixation_type?.name },
        { label: "🎨 Колір системи", value: orderObject.color_system },
        { label: "🔢 Кількість", value: `${orderObject.count_number} шт.`, dashedBorder: true },
    ];

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [price, setPrice] = useState<ICalculateResponce | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        async function getPrice() {
            setIsLoading(true);
            const login = await getDataFromAcyncStorage(ASYNC_STORAGE_USER_LOGIN);

            const orderParams: ICulculateOrderObject = {
                login: login || "",
                add_to_cart: false,
                group_code: orderObject.group.code as MainGroupsCode,
                subgroup_code: orderObject.subgroup?.code as string,
                product_code: orderObject.product?.name as string,
                height: Number(orderObject.height_gab as string),
                width: Number(orderObject.width_gab as string),
                quantity: orderObject.count_number ? +orderObject.count_number : 0,
                side: (orderObject.controlType as string) === 'L' ? "left" : "right",
                system_color: orderObject.color_system as string,
                units: "см",
                // 
                fixation_type: orderObject.fixation_type?.name || "",
                options: orderObject.options || "",
            }

            const calculates = await calculateOrderPriceDayNight(orderParams);

            if (calculates === null) {
                setIsError(true);

                setTimeout(() => setIsError(false), 3000)
            }
            setPrice(calculates);
            setIsLoading(false);
        }
        getPrice();
    }, [orderObject]);


    return (
        <AnimatedWrapper>

            <Pressable
                onPress={() => setIsOpen(!isOpen)}
                style={styles.container}>
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
                                {orderObject.width_gab}x{orderObject.height_gab}
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
                            <Text style={[styles.previewBox, {
                                borderWidth: 2,
                                borderColor: price ? Colors.blue : Colors.red,
                                backgroundColor: price ? Colors.blueLight : '#FF0A0A10'
                            }]}>
                                {price !== null ? price.total_price.toFixed(2) : ""} $
                            </Text>
                            <Text style={[styles.previewBox, {
                                borderWidth: 2,
                                borderColor: price ? Colors.blue : Colors.red,
                                backgroundColor: price ? Colors.blueLight : '#FF0A0A10'
                            }]}>
                                {price !== null ? price.total_price_uah.toFixed(2) : ""} грн.
                            </Text>
                        </View>
                            :
                            <Loader radius={40} />
                        }
                    </View>
                ) : null}
            </Pressable>


            {isError && <ErrorMessage errorText="Помилка запиту розрахунку вартості!" />}
            {isOpen ? (
                <View style={styles.expandedContainer}>
                    {itemRows.map(({ label, value, dashedBorder }, index) => (
                        <RowItem key={index} label={label} value={value} dashedBorder={dashedBorder} index={index} />
                    ))}
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
            <Text style={styles.rowValue}>{value}</Text>
        </AnimatedWrapper>
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
        borderColor: Colors.blueLight
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
        fontSize: 14,
        lineHeight: 16,
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
    },
    previewColumn: {
        gap: 5
    },
    previewBox: {
        fontFamily: Fonts.openSans400,
        fontSize: 14,
        textAlign: 'center',
        padding: 5,
        borderRadius: 8,
        backgroundColor: Colors.blueLight,
        color: 'black',
    },
    expandedContainer: {
        backgroundColor: 'white',
        padding: 5,
        top: -20,
        borderRadius: 8
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
        fontSize: 14,
        fontFamily: Fonts.comfortaa600,
        color: "#707070",
    },
    rowValue: {
        fontSize: 14,
        fontFamily: Fonts.comfortaa600,
        maxWidth: '70%'
    }
});
