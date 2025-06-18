import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Colors } from "../../theme/colors";
import { Fonts } from "../../theme/fonts";
import { ICategory, IProductItem } from "../../lib/types";
import { getCorrectWordDeclension } from "../../lib/utils";
import { SYSTEM_SALE_CATEGORY_ID, SYSTEM_TOP_CATEGORY_ID } from "../../lib/hooks/useCatalogCategories";
import AnimatedWrapper from "../animation/AnimatedWrapper";

interface IProps {
    categoriesList: ICategory[],
    catalogList: IProductItem[] | null,
    cardPressHandler: (categoryId: string) => void
}

function CategoriesList({ categoriesList, catalogList, cardPressHandler }: IProps) {
    return (
        <ScrollView style={styles.listContainer}>
            <View style={styles.listWrap}>
                {categoriesList.map((category, index) => (
                    <AnimatedWrapper
                        key={index + category.name}
                        style={styles.categoryItem}
                        offsetX={50}
                        useOpacity
                        delay={(index / 2) * 100}
                        duration={300}
                    >
                        <Pressable
                            onPress={() => cardPressHandler(String(category.id))}
                        >
                            <View style={{ height: "100%", width: "100%" }}>
                                <ImageBackground
                                    source={getCategoryBcgCardImage(category.name)}
                                    resizeMode="cover"
                                    style={styles.categoryBcgImage}
                                >
                                    <DetailsCount
                                        catalogList={catalogList}
                                        categoryId={category.id}
                                    />
                                </ImageBackground>
                                <CategoryName categoryName={category.name} />
                            </View>
                        </Pressable>
                    </AnimatedWrapper>
                ))}
            </View>
        </ScrollView>
    )
};

export default CategoriesList;

//  styles
const styles = StyleSheet.create({
    listContainer: {
        width: "100%",
        marginBottom: 130,
        paddingBottom: 50
    },
    listWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        padding: 10,
    },
    categoryItem: {
        height: 272,
        width: "48%",
        marginBottom: 30,
    },
    categoryBcgImage: {
        height: "100%",
        width: "100%",
        borderRadius: 11,
        overflow: "hidden",
        backgroundColor: Colors.blue,
        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        // Android shadow
        elevation: 5,
    },
    categoryName: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 16,
        color: "white",
        textAlign: "center",
        position: "absolute",
        bottom: 0,
        borderBottomLeftRadius: 11,
        borderTopRightRadius: 11,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: Colors.blue,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderColor: 'white'
    },
    detailsCountText: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 10,
        backgroundColor: Colors.blue,
        position: "absolute",
        top: 0,
        right: 0,
        paddingBottom: 8,
        paddingTop: 6,
        paddingHorizontal: 8,
        borderBottomLeftRadius: 11,
        color: "white",
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderColor: Colors.pale,
    },
});

// ui
function CategoryName({ categoryName }: { categoryName: string }) {
    return (
        <AnimatedWrapper
            useOpacity
            duration={300}
            delay={150}
        >
            <Text style={styles.categoryName}>
                {categoryName}
            </Text>
        </AnimatedWrapper>
    )
}

function DetailsCount({ catalogList, categoryId }: { catalogList: IProductItem[] | null, categoryId: number }): JSX.Element {
    const countValue = getCategoryListCount(categoryId, catalogList as IProductItem[]);
    const textValue = getCorrectWordDeclension(countValue, "пропозицій");

    return (
        <AnimatedWrapper
            useOpacity
            offsetX={50}
            offsetY={-50}
            duration={300}
            delay={100}
        >
            <Text style={styles.detailsCountText}>
                {countValue} {textValue}
            </Text>
        </AnimatedWrapper>
    )
}

// utils
function getCategoryBcgCardImage(categoryName: string) {
    if (categoryName === "День-Ніч") {
        return require("../../assets/catalog-screen/day-night-blinds.png");
    } else if (categoryName === "Рулонні") {
        return require("../../assets/catalog-screen/roller-blinds.png");
    } else if (categoryName === "Горизонтальні") {
        return require("../../assets/catalog-screen/horisontal-blinds.png")
    } else if (categoryName === "Вертикальні") {
        return require("../../assets/catalog-screen/vertical-blinds.png")
    } else if (categoryName === "Комплектуючі") {
        return require("../../assets/catalog-screen/components.png")
    } else if (categoryName === "Акція") {
        return require("../../assets/catalog-screen/sale.png")
    } else if (categoryName === "Топ-продукція") {
        return require("../../assets/catalog-screen/top-product.png")
    } else {
        return require("../../assets/catalog-screen/advertising-products.png")
    }
};

function getCategoryListCount(categoryId: number, catalogList: IProductItem[] | null): number {
    let count: number;

    if (catalogList === null) {
        count = 0;
    } else if (categoryId === SYSTEM_SALE_CATEGORY_ID) {
        count = catalogList.filter((product) => product.price.sale !== null).length;
    } else if (categoryId === SYSTEM_TOP_CATEGORY_ID) {
        count = catalogList.filter((product) => product.sort_order === 1).length;
    } else {
        count = catalogList.filter((product) => product.category_id === categoryId).length;
    }

    return count;
};

