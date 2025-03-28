import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Colors } from "../../theme/colors";
import { Fonts } from "../../theme/fonts";
import { ICategory, IProductItem } from "../../lib/types";
import { getCorrectWordDeclension } from "../../lib/utils";

interface IProps {
    categoriesList: ICategory[],
    catalogList: IProductItem[] | null,
    cardPressHandler: (categoryId: string) => void
}

function CateforiesList({ categoriesList, catalogList, cardPressHandler }: IProps) {
    return (
        <ScrollView style={styles.listContainer}>
            <View style={styles.listWrap}>
                {categoriesList.map((category, index) => (
                    <TouchableOpacity
                        key={category.name + index}
                        style={styles.categoryItem}
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
                            <Text style={styles.categoryName}>
                                {category.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    )
};

export default CateforiesList;

//  styles
const styles = StyleSheet.create({
    listContainer: {
        width: "100%",
        marginBottom: 130
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
        marginBottom: 50,
    },
    categoryBcgImage: {
        height: "100%",
        width: "100%",
        borderRadius: 11,
        overflow: "hidden",
        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        // Android shadow
        elevation: 5,
    },
    categoryName: {
        fontFamily: Fonts.openSans400,
        fontSize: 16,
        color: "#09022A",
        textAlign: "center",
        marginTop: 8
    },
    detailsCountText: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 10,
        backgroundColor: Colors.blue,
        position: "absolute",
        bottom: 0,
        right: 0,
        paddingBottom: 8,
        paddingTop: 6,
        paddingHorizontal: 8,
        borderTopLeftRadius: 11,
        color: "white",
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderColor: Colors.pale,
    },
});

// ui
function DetailsCount({ catalogList, categoryId }: { catalogList: IProductItem[] | null, categoryId: number }): JSX.Element {
    const countValue = getCategoryListCount(categoryId, catalogList as IProductItem[]);
    const textValue = getCorrectWordDeclension(countValue, "пропозицій");

    return (
        <Text style={styles.detailsCountText}>
            {countValue} {textValue}
        </Text>
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
    } else {
        return require("../../assets/catalog-screen/advertising-products.png")
    }
};

function getCategoryListCount(categoryId: number, catalogList: IProductItem[] | null): number {
    if (catalogList === null) return 0;

    const filtredList = catalogList.filter((product) => product.category_id === categoryId);

    return filtredList.length;
};

