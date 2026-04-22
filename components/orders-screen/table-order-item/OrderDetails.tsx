import { StyleSheet, Text, View, ScrollView, Dimensions, Image, StyleProp, ViewStyle, Pressable } from "react-native";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";
import { IOrder, IOrderItem } from "../../../lib/api/orders-screen/ordersList";
import { Status } from "./Order";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { useEffect, useState } from "react";
import { getActiveUnits, getFormatedOrderType } from "../../../lib/utils";
import { MainGroupsCode } from "../../../lib/api/orders-screen/groups-and-products";
import { UnitsTypes } from "../../../lib/api/auth";
import { filterOrderFromOtherServices, isOrderItem } from "../../../lib/api/orders-screen/utils";

function OrderDetails({ order }: { order: IOrder }) {
    const [units, setUnits] = useState<UnitsTypes | null>(null); // actual units value

    useEffect(() => {
        async function getUnits() {
            const actualUnits = await getActiveUnits();
            setUnits(actualUnits);
        };
        getUnits();
    }, [order]);

    const {
        ['N_заказа']: id,
        ['вид заказа']: group,
        ['статус']: status,
        ['дата_заказа']: createDate,
        ['дата готовности']: completionDate,
        // ['площадь, м.кв.']: fullArea,
        // ["дата готовности"]: finishDate,
        ["адрес доставки"]: deliveryAddress,
        ["сумма"]: fullPrice,
        ['комментарий']: comment,
        ["комментарий менеджера"]: managerComment,
        items: orderItems,
    } = order;

    const fullArea = orderItems.reduce((acc, item) => {
        const area = parseFloat(item["площадь, м.кв."]);
        return acc + (isNaN(area) ? 0 : area);
    }, 0);

    const sortedOrderItems = orderItems.sort(
        (a, b) => Number(a["характерстика"] === null) - Number(b["характерстика"] === null)
    );

    return (
        <View style={styles.detailsContainer}>
            <AnimatedWrapper
                useOpacity
                offsetY={20}
                delay={200}
            >
                <Text style={[styles.orderId, styles.shadow]}>#{id}</Text>

                <View style={styles.headerRow}>
                    <Text style={styles.orderGroup}>{getFormatedOrderType(group).toUpperCase()}</Text>
                    <Status statusValue={status} style={styles.statusStyle} />
                </View>
            </AnimatedWrapper>

            <AnimatedWrapper
                useOpacity
                offsetY={20}
                delay={240}
            >
                <Detail label="Дата замовлення:" value={formatDateAndTime(createDate)} />
                <Detail label="Дата готовності:" value={completionDate ? formatDateAndTime(completionDate) : "—"} />
                <Detail label="Загальна площа:" value={fullArea.toFixed(2) + " м²"} />
            </AnimatedWrapper>

            <AnimatedWrapper
                useOpacity
                offsetY={20}
                delay={280}
                style={styles.scrollWrap}
            >
                <View style={styles.itemsHeader}>
                    <Text style={styles.itemsLabel}>Позицій в замовленні: </Text>
                    <Text style={styles.itemsCount}>{filterOrderFromOtherServices(orderItems).length}</Text>
                    <Arrows />
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.itemsScrollContent}
                    style={styles.itemsScroll}
                >
                    {(sortedOrderItems.length || !units) ?
                        sortedOrderItems.map((item, index) => (
                            <OrderItem
                                key={item['N_заказа'] + index}
                                item={item}
                                group={group as MainGroupsCode}
                                units={units}
                                style={{ marginRight: ++index === orderItems.length ? 30 : 0 }}
                            />
                        ))
                        :
                        null}
                </ScrollView>
            </AnimatedWrapper>

            <AnimatedWrapper
                style={[styles.commentBox]}
                useOpacity
                offsetY={20}
                delay={320}
            >
                <CollapsibleText label="Коментар менеджера" text={managerComment} />
                <CollapsibleText label="Коментарій" text={comment} />
            </AnimatedWrapper>

            <AnimatedWrapper
                style={[styles.addressBox]}
                useOpacity
                offsetY={20}
                delay={360}
            >
                <CollapsibleText label="Адреса" text={deliveryAddress} />
            </AnimatedWrapper>

            <AnimatedWrapper
                style={[styles.priceBox]}
                useOpacity
                offsetY={20}
                delay={400}>
                <Detail label="💰 Загальна вартість:" value={fullPrice + "$"} />
            </AnimatedWrapper>
        </View>
    )
}

export default OrderDetails;

// UI

function CollapsibleText({ label, text }: { label: string, text?: string }) {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => setExpanded(!expanded);

    const MAX_LENGTH = 60;
    const isLongText = text && text.length > MAX_LENGTH;
    const displayText =
        !isLongText || expanded
            ? text
            : text?.slice(0, MAX_LENGTH) + "…";

    return (
        <Pressable onPress={toggleExpanded}>
            <Text style={[styles.detailLabel, { marginBottom: 10 }]}>
                {label}:{" "}
                <Text style={styles.detailValue}>
                    {text ? displayText : "—"}
                </Text>
            </Text>

            {isLongText && (
                <Image
                    source={require('../../../assets/orders-screen/arrow.webp')}
                    style={[styles.collapdeImage, {
                        transform: [{ rotate: expanded ? '270deg' : '90deg' }]
                    }]}
                />
            )}
        </Pressable>
    );
}

function Detail({ label, value, borderBottom = false }: { label: string, value: string | number | null, borderBottom?: boolean }) {
    if (value === '—' || String(value) === ' ' || !value) return null;

    return (
        <View style={[styles.detailRow, borderBottom && styles.bordeBottom]}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value ? value : '—'}</Text>
        </View>
    );
}

function OrderItem({ item, group, units, style }: { item: IOrderItem, group: MainGroupsCode, units: UnitsTypes, style?: StyleProp<ViewStyle> }) {

    const isOrder = isOrderItem(item);
    if (!isOrder) return <ServiceItem item={item} />

    const { width, height, controlSide, color, fixation } = formatCharacteristicsString(item['характерстика']);
    const widthValue = (units === "мм" ? Number(width) * 10 : Number(width)) + " " + units;
    const heightValue = (units === "мм" ? Number(height) * 10 : Number(height)) + " " + units;;

    const isComponentsOrAdsGroup = group === 'components' || group === 'ads';

    return (
        <View style={[styles.itemCard, styles.shadow, style]}>
            <Text style={styles.itemTitle} numberOfLines={2}>
                {item['наименование'] || 'Без названия'}
            </Text>

            <Detail label="Кількість:" value={parseFloat(item['кол_во'])} />
            {!isComponentsOrAdsGroup &&
                <>
                    <Detail label="Площа:" value={item['площадь, м.кв.'] + " м²"} />
                    <Detail label="Ширина:" value={widthValue} />
                    <Detail label="Висота:" value={heightValue} />
                    <Detail label="Керування:" value={controlSide} />
                    <Detail label="Колір:" value={color} />
                    <Detail label="Фіксація:" value={fixation} borderBottom />
                </>
            }

            <Detail label="Вартість:" value={parseFloat(item['стоим']) + "$"} />
        </View>
    )
};

function ServiceItem({ item }: { item: IOrderItem }) {
    const title = item['наименование'].toLowerCase();
    if (title === "замер" || title === "доставка" || title === "установка") {
        return (
            <View style={[styles.itemCardService, styles.shadow]}>
                <Text style={[styles.itemTitle, styles.itemServiceTitle]} numberOfLines={2}>
                    {item['наименование'] || 'Без названия'}
                </Text>

                <Detail label="Вартість:" value={parseFloat(item['стоим']) + "$"} />
            </View>
        )
    } else {
        return (
            <View style={[styles.itemCard, { height: 100 }, styles.shadow]}>

                <Text style={styles.itemTitle} numberOfLines={2}>
                    {'Фіксація: ' + (item['наименование'] || 'Без названия')}
                </Text>

                <Detail label="Вартість:" value={parseFloat(item['стоим']) + "$"} />
            </View>
        )
    }
}

export function Arrows() {
    return (
        <>
            <Image source={require('../../../assets/orders-screen/arrow-right.png')} style={styles.arrowRight} />
            <Image source={require('../../../assets/orders-screen/arrow-right.png')} style={styles.arrowLeft} />
        </>
    )
};

// UTILS

function formatDateAndTime(dateString: string): string {
    if (dateString === null) return '';

    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-');

    if (timePart) {
        const [hours, minutes] = timePart.split(':');
        return `${day}.${month}.${year} – ${hours}:${minutes}`;
    }

    return `${day}.${month}.${year}`;
}

export function formatCharacteristicsString(value: string) {
    if (value === null) return {
        width: '—',
        height: '—',
        controlSide: '—',
        color: '—',
        fixation: '—'
    };

    const separate = value.split(',');
    const dimensions = separate[0].split('*');

    return {
        width: dimensions[0],
        height: dimensions[1],
        controlSide: separate[1],
        color: separate[2],
        fixation: separate[3]
    };
};

// STYLES

const styles = StyleSheet.create({
    detailsWrapper: {
        borderTopWidth: 2,
        borderTopColor: Colors.pale,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#D9D9D9',
    },
    detailsContainer: {
        marginTop: 35,
        padding: 5,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        position: 'relative',
    },
    orderId: {
        position: 'absolute',
        top: -45,
        paddingTop: 5,
        paddingBottom: 3,
        paddingHorizontal: 5,
        borderRadius: 10,
        backgroundColor: Colors.blue,
        color: 'white',
        width: 100,
        fontFamily: Fonts.comfortaa700,
        fontSize: 16,
        lineHeight: 18,
        textAlign: 'center',

    },
    headerRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: Colors.grayLight,
        paddingBottom: 5,
        marginBottom: 10,
    },
    orderGroup: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 20,
        lineHeight: 24,
        color: Colors.blue,
    },
    statusStyle: {
        paddingVertical: 5,
        margin: 0,
    },
    itemsHeader: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 10,
        paddingTop: 5,
        paddingHorizontal: 15,
        borderTopWidth: 1,
        borderColor: Colors.grayLight,
    },
    itemsLabel: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 14,
        color: Colors.gray,
    },
    itemsCount: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 14,
        lineHeight: 22,
        color: 'white',
        width: 20,
        height: 20,
        backgroundColor: Colors.blue,
        borderRadius: 50,
        textAlign: 'center',
    },
    commentBox: {
        paddingTop: 8,
        paddingBottom: 0,
        paddingHorizontal: 5,
        borderRadius: 12,
    },
    addressBox: {
        marginTop: 10,
        paddingTop: 7,
        paddingBottom: 4,
        paddingHorizontal: 5,
        borderRadius: 12,
    },
    priceBox: {
        backgroundColor: 'white',
        paddingTop: 7,
        paddingBottom: 4,
        paddingHorizontal: 5,
        borderRadius: 12,
        marginTop: 10,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 7,
        marginBottom: 4,
    },
    detailLabel: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 14,
        lineHeight: 17,
        color: Colors.gray,
    },
    detailValue: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 14,
        lineHeight: 16,
        color: 'black',
        maxWidth: '60%',
    },
    bordeBottom: {
        borderBottomWidth: 2,
        borderColor: Colors.grayLight,
        paddingBottom: 5,
        marginBottom: 5,
    },
    scrollWrap: {
        marginHorizontal: -15,
    },
    itemsScroll: {
        marginTop: 5,
        marginBottom: 10,
    },
    itemsScrollContent: {
        paddingVertical: 8,
        gap: 10,
        paddingHorizontal: 12
    },
    itemCard: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        width: 250,
        maxWidth: Dimensions.get('window').width - 60,
        overflow: 'hidden',
    },
    itemCardService: {
        backgroundColor: Colors.pale,
        padding: 12,
        borderRadius: 12,
        width: 180,
        height: 80,
        overflow: 'hidden',
    },
    itemTitle: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 14,
        lineHeight: 16,
        color: 'white',
        backgroundColor: Colors.blue,
        paddingVertical: 7,
        paddingHorizontal: 9,
        marginBottom: 4,
        top: -12,
        left: -12,
        width: '115%',
    },
    itemServiceTitle: {
        backgroundColor: '#1CBCD7',
    },
    itemSpecs: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 14,
        lineHeight: 16,
        color: 'black',
        maxWidth: 180,
        marginTop: 5,
        marginBottom: 20,
    },
    arrowRight: {
        width: 20,
        height: 20,
        opacity: 0.1,
        position: 'absolute',
        right: 0,
        top: 10,
    },
    arrowLeft: {
        width: 20,
        height: 20,
        opacity: 0.1,
        position: 'absolute',
        right: 0,
        top: 10,
        transform: [{ rotate: '180deg' }],
        marginRight: 25,
    },
    shadow: {
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    // collapseble text
    collapdeImage: {
        width: 7,
        height: 12,
        resizeMode: "contain",
        position: 'absolute',
        top: 5,
        right: -7
    }
});
