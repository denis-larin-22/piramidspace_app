import React, { useRef, useState } from "react";
import { Animated, FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../theme/colors";
import { Fonts } from "../theme/fonts";
import { getAvailabilityTextColor } from "../lib/utils";

function CatalogItemScreen() {
    const [isInfoHide, setIsInfoHide] = useState<boolean>(false);


    const product = {
        id: 24,
        name: "Манга - аквамарин",
        category_id: 1,
        availability: "В наявності",
        date_on_stock: null,
        low_stock_meters: null,
        sort_order: 0,
        price: {
            price_1: "2000.00",
            price_2: "3000.00",
            price_3: "4000.00",
            price_4: "5000.00",
            price_5: "1.00",
            sale: "25",
            date_on_sale: null,
            date_off_sale: null
        },
        category: {
            id: 1,
            name: "День-Ніч"
        },
        images_url: [
            "https://api.piramidspace.com/storage/products/H2JEBxGcWXobeoMMnD16bsRspkwMQ7Jyng5J7EvX.jpg",
            "https://api.piramidspace.com/storage/default.jpg",
            "https://api.piramidspace.com/storage/default.jpg",
            "https://api.piramidspace.com/storage/default.jpg"
        ],
        technical_info: {
            name: "Манга - аквамарин",
            blackout: "Пропускання світла змінюється залежно від налаштування смуг.",
            water_resistance: "Оброблена водостійким покриттям, але  не можна прати, догляд - суха чистка.",
            fabric_texture: null,
            composition: "100% поліестер",
            warranty: "12 місяців",
            roll_width: "280",
            tape_width: null,
            collection: "Манга",
            transparency: "Напівпрозора - пропускає від 40% до 70% світла",
            color: "Аквамарин",
            description: "Тканина має смуги прозорої та щільної текстури.  Висота прозорої смуги 5см, висота щільної смуги 7,5см.",
            max_width: "153.00",
            max_height: "230.00",
            max_area: "3.50"
        }
    }

    const technicalInformation = [
        { item: "Затемнення", info: product.technical_info.transparency },
        { item: "Водостійкість", info: product.technical_info.water_resistance },
        { item: "Фактура тканини", info: product.technical_info.fabric_texture },
        { item: "Склад", info: product.technical_info.composition },
        { item: "Гарантія", info: product.technical_info.warranty },
        { item: "Ширина рулону", info: product.technical_info.roll_width ? (product.technical_info.roll_width + " мм") : null },
        { item: "Ширина ламелі", info: product.technical_info.tape_width ? (product.technical_info.tape_width + " мм") : null }
    ];

    return (
        <View style={styles.fullHeight}>
            <StatusBar hidden={true} />

            <TouchableOpacity
                style={{
                    ...styles.fullWidth,
                    height: isInfoHide ? "100%" : "50%",
                }}
                onPress={() => {
                    setIsInfoHide(!isInfoHide);
                }}
            >
                <Image
                    source={{ uri: product.images_url[0] }}
                    style={{
                        ...styles.fullHeight,
                        ...styles.fullWidth,
                        resizeMode: isInfoHide ? "contain" : "cover"
                    }}
                />
            </TouchableOpacity>

            {!isInfoHide &&
                <ScrollView style={styles.info}>
                    <View style={styles.infoWrap}>
                        <Text style={styles.infoCollection}>
                            {product.category.name} / {product.technical_info.collection}
                        </Text>
                        <Text
                            style={{
                                ...styles.infoAvailability,
                                color: getAvailabilityTextColor(product.availability),
                            }}
                        >
                            {product.availability}
                        </Text>
                    </View>

                    <Text style={styles.infoName}>
                        {product.name}
                    </Text>

                    <SaleMark saleValue={product.price.sale} />

                    <Text
                        style={{
                            ...styles.infoTitle,
                            marginBottom: 14
                        }}
                    >Опис</Text>
                    <Text
                        style={{
                            ...styles.infoText,
                            marginBottom: 14,
                        }}
                    >
                        {product.technical_info.description}
                    </Text>

                    <Text style={styles.infoTitle}>Технічна інформація</Text>

                    <View style={styles.separator}></View>

                    <View style={styles.infoList}>
                        {technicalInformation.map((item, index) => (
                            <View
                                key={index}
                                style={{
                                    width: "48%",
                                    marginBottom: 10,
                                }}
                            >
                                <Text style={{
                                    ...styles.infoTitle,
                                    marginBottom: 5,
                                }}>
                                    {item.item}
                                </Text>
                                <Text style={styles.infoText}>
                                    {item.info === null ?
                                        "відсутнє"
                                        :
                                        item.info
                                    }
                                </Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>}
        </View>
    );
}

export default CatalogItemScreen;

function SaleMark({ saleValue }: { saleValue: string }) {
    return (
        <View style={styles.saleWrap}>
            <Image
                source={require('../assets/catalog-screen/fire-icon.png')}
                style={styles.saleIcon}
            />
            <Text style={styles.saleText}>Акція {saleValue}%</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    fullWidth: {
        width: '100%'
    },
    fullHeight: {
        height: '100%'
    },
    info: {
        height: "55%",
        paddingHorizontal: 36,
        paddingVertical: 40,
        backgroundColor: Colors.pale,
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        position: "absolute",
        top: '45%'
    },
    infoWrap: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12
    },
    infoCollection: {
        color: "#AEB1BA",
        fontFamily: Fonts.openSans400,
        fontSize: 12
    },
    infoAvailability: {
        fontFamily: Fonts.openSans400,
        fontSize: 14
    },
    infoName: {
        color: Colors.blueDark,
        fontFamily: Fonts.comfortaa400,
        fontSize: 32,
        marginBottom: 36
    },
    infoTitle: {
        color: Colors.blueDark,
        fontFamily: Fonts.openSans400,
        fontSize: 16,
    },
    infoText: {
        fontFamily: Fonts.openSans400,
        fontSize: 14,
        color: "#B3B5BE"
    },
    separator: {
        width: "100%",
        height: 1,
        backgroundColor: "#DDE0E9",
        marginVertical: 14
    },
    infoList: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        rowGap: 24,
        marginBottom: 50
    },
    // sale icon
    saleWrap: {
        position: "relative",
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 5,
        backgroundColor: "#FFEFD1",
        alignSelf: "flex-start",
        paddingBottom: 5,
        paddingTop: 2,
        paddingRight: 12,
        borderRadius: 36,
        marginBottom: 40
    },
    saleIcon: {
        width: 24,
        height: 38,
        position: "absolute",
        left: 4,
        bottom: 2
    },
    saleText: {
        color: Colors.orange,
        marginLeft: 35,
        fontFamily: Fonts.comfortaa700,
        fontSize: 12
    },
});