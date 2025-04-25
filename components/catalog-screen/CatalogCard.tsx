import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IProductItem } from "../../lib/types";
import { Fonts } from "../../theme/fonts";
import { Colors } from "../../theme/colors";
import { getAvailabilityTextColor } from "../../lib/utils";
import { CachedImage } from "../ui/CashedImage";

interface IProps {
    product: IProductItem,
    onPressHandler: (productId: number) => void
}

function CatalogCard({ product, onPressHandler }: IProps) {
    const imageUrl = product.images_url[0] as string;
    const isTopProduct = Boolean(product.sort_order);
    const saleValue = product.price.sale;

    return (
        <TouchableOpacity
            key={product.id}
            style={{
                ...style.cardWrap,
                opacity: product.availability === "Немає" || product.availability === "Виробництво припинено" ? 0.7 : 1,
            }}
            onPress={() => onPressHandler(product.id)}
        >
            <CachedImage
                source={imageUrl}
                style={style.productImage}
            />

            {isTopProduct &&
                <Image
                    source={require('../../assets/catalog-screen/top-product.png')}
                    style={style.topProductItem}
                />}
            <View
                style={{
                    ...style.infoWrap,
                    backgroundColor: isTopProduct ? Colors.blue : 'white',
                }}
            >
                {product.availability === "Закінчується" &&
                    product.low_stock_meters &&
                    <BalanceStock balanceValue={product.low_stock_meters} />
                }
                {saleValue && <SaleMark saleValue={saleValue} />}

                <Text
                    style={{
                        color: isTopProduct ? "white" : "#AEB1BA",
                        ...style.infoCollection
                    }}
                >
                    {product.technical_info.collection?.toUpperCase()}
                </Text>
                <Text
                    style={{
                        color: isTopProduct ? "white" : "#0E0050",
                        ...style.infoName
                    }}
                >
                    {product.name}
                </Text>
                <Text
                    style={{
                        color: getAvailabilityTextColor(product.availability),
                        ...style.infoAvailability,
                    }}
                >
                    {product.availability.toLowerCase()}
                </Text>
            </View>
            {/* </ImageBackground> */}
        </TouchableOpacity >
    )
};

export default CatalogCard;

// ui
function SaleMark({ saleValue }: { saleValue: string }) {
    return (
        <View
            style={style.saleWrap}
        >
            <Image
                source={require('../../assets/catalog-screen/fire-icon.png')}
                style={style.saleIcon}
            />
            <Text style={style.saleText}>Акція {saleValue}%</Text>
        </View >
    )
};

function BalanceStock({ balanceValue }: { balanceValue: string }) {
    return (
        <Text
            style={style.balanceStock}
        > Лишилось {balanceValue ? balanceValue : ""} м.
        </Text>
    )
}

// styles
const style = StyleSheet.create({
    cardWrap: {
        position: "relative",
        width: "100%",
        height: 231,
        borderRadius: 12,
        overflow: "hidden",
        justifyContent: 'flex-end',

        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        // Android shadow
        elevation: 5,
    },
    topProductItem: {
        width: 48,
        height: 48,
        position: 'absolute',
        top: 6,
        right: 6,
        zIndex: 10
    },
    productImage: {
        height: "100%",
        width: "100%",
        position: "absolute",
        zIndex: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    infoWrap: {
        margin: 8,
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 11,
    },
    infoCollection: {
        fontFamily: Fonts.openSans400,
        fontSize: 8,
        marginBottom: 4,
    },
    infoName: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 14,
        marginBottom: 21
    },
    infoAvailability: {
        fontFamily: Fonts.openSans400,
        fontSize: 9,
        lineHeight: 10,
        backgroundColor: "white",
        paddingHorizontal: 4,
        paddingVertical: 2,
        alignSelf: "flex-start",
        borderRadius: 36
    },
    // Sale mark
    saleWrap: {
        position: "absolute",
        right: 0,
        top: -23,
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 5,
        backgroundColor: "#FFEFD1",
        alignSelf: "flex-start",
        paddingBottom: 2,
        paddingTop: 1,
        paddingRight: 7,
        borderRadius: 36
    },
    saleIcon: {
        width: 20,
        height: 32,
        position: "absolute",
        left: 4,
        bottom: 2
    },
    saleText: {
        color: Colors.orange,
        marginLeft: 30,
        fontFamily: Fonts.comfortaa700,
        fontSize: 10
    },
    bgLoader: {
        position: "absolute",
        alignSelf: "center",
        top: '25%',
        zIndex: 1,
    },
    balanceStock: {
        position: 'absolute',
        top: -25,
        zIndex: 10,
        alignSelf: 'flex-end',
        fontFamily: Fonts.openSans700,
        fontSize: 10,
        color: 'white',
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 35,
        backgroundColor: '#F79D1580',
        borderWidth: 2,
        borderColor: '#F79D15',
        opacity: 0.9
    }
});

