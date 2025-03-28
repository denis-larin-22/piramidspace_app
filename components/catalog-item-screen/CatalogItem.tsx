import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../theme/colors";
import { Fonts } from "../../theme/fonts";
import { useState } from "react";
import { getAvailabilityTextColor } from "../../lib/utils";
import { IProductItem } from "../../lib/types";
import { CatalogItemScreenNavigationProp } from "../../screens/CatalogItemScreen";
import BackButton from "../ui/BackButton";

interface IProps {
    product: Omit<IProductItem, 'price'>,
    navigation: CatalogItemScreenNavigationProp,
}

function CatalogItem({ product, navigation }: IProps) {
    const [isInfoHide, setIsInfoHide] = useState<boolean>(false);
    const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

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
        <>
            <View
                style={{
                    position: "absolute",
                    top: 20,
                    left: 10,
                    zIndex: 30,
                }}
            >
                <BackButton
                    text="Назад"
                    onPressAction={() => {
                        navigation.navigate('CatalogScreen', { activeCategoryId: String(product.category_id) })
                    }}
                />
            </View>

            <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
            />

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
                    source={{ uri: product.images_url[activeImageIndex] as string }}
                    style={{
                        ...styles.fullHeight,
                        ...styles.fullWidth,
                        resizeMode: isInfoHide ? "contain" : "cover"
                    }}
                />
            </TouchableOpacity>

            <View style={styles.imageList}>
                {product.images_url.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.imageListButton}
                        onPress={() => {
                            setActiveImageIndex(index)
                        }}
                    >
                        <Image
                            source={{ uri: product.images_url[index] as string }}
                            style={{
                                ...styles.imageListImage,
                                borderColor: activeImageIndex === index ? Colors.blueDark : "transparent"
                            }}
                        />
                    </TouchableOpacity>
                ))}
            </View>

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

                    {/* {product.price.sale && <SaleMark saleValue={product.price.sale} />} */}

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
        </>
    )
};

export default CatalogItem;

function SaleMark({ saleValue }: { saleValue: string }) {
    return (
        <View style={styles.saleWrap}>
            <Image
                source={require('../../assets/catalog-screen/fire-icon.png')}
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
    logo: {
        width: 129,
        height: 35,
        resizeMode: 'contain',
        position: 'absolute',
        top: 20,
        right: 10,
        zIndex: 30
    },
    imageList: {
        flexDirection: "row",
        gap: 10,
        zIndex: 50,
        position: "relative",
        bottom: 110,
        left: 20
    },
    imageListButton: {
        width: 46,
        height: 46,
    },
    imageListImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        borderRadius: 6,
        borderWidth: 1,
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