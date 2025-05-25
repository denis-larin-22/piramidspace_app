import { ActivityIndicator, FlatList, StyleSheet, View, StatusBar } from "react-native";
import { Colors } from "../theme/colors";
import CatalogCard from "../components/catalog-screen/CatalogCard";
import Logo from "../components/ui/Logo";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppStack";
import BackButton from "../components/ui/BackButton";
import { IProductItem } from "../lib/types";
import { RouteProp } from "@react-navigation/native";
import { Fonts } from "../theme/fonts";
import { useCatalogList } from "../lib/hooks/useCatalogList";
import { useEffect, useState } from "react";
import Filters from "../components/catalog-screen/Filters";
import { SYSTEM_SALE_CATEGORY_ID, SYSTEM_TOP_CATEGORY_ID } from "../lib/hooks/useCatalogCategories";
import AnimatedWrapper from "../components/animation/AnimatedWrapper";

export type CatalogScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "CatalogScreen">;
type CatalogScreenRouteProp = RouteProp<RootStackParamList, "CatalogScreen">;

export interface ICatalogListByCategory {
    initList: IProductItem[],
    renderList: IProductItem[]
}

function CatalogScreen({ navigation, route }: { navigation: CatalogScreenNavigationProp, route: CatalogScreenRouteProp }) {
    const { activeCategoryId } = route.params;
    const { catalogList, isLoading } = useCatalogList();

    const [catalogListByCategory, setCatalogListByCategory] = useState<ICatalogListByCategory>({
        initList: [],
        renderList: []
    });

    useEffect(() => {
        const filtredByCategory = getFiltredCatalogBySelectedCategory(+activeCategoryId, catalogList);

        setCatalogListByCategory({
            initList: filtredByCategory,
            renderList: filtredByCategory
        });
    }, [catalogList]);

    return (
        <View style={styles.screenWrap}>
            <StatusBar
                hidden={false}
                translucent={false}
                barStyle="dark-content"
                backgroundColor={Colors.pale}
            />

            <View style={styles.backButtonWrap}>
                <BackButton
                    text="Усі категорії"
                    onPressAction={() => navigation.goBack()}
                />

                <Logo />
            </View>

            {isLoading ?
                <View style={styles.loaderWrap}>
                    <ActivityIndicator
                        color={Colors.blue}
                        size={"large"}
                    />
                </View>
                :
                <>
                    <Filters
                        catalogList={catalogListByCategory}
                        setCatalogList={setCatalogListByCategory}
                    />
                    <FlatList
                        data={catalogListByCategory.renderList}
                        horizontal={false}
                        numColumns={2}
                        keyExtractor={(product) => product.id.toString()}
                        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 10 }}
                        contentContainerStyle={{ paddingHorizontal: 15 }}
                        renderItem={({ item, index }) => (
                            <AnimatedWrapper
                                key={index + item.id}
                                style={{
                                    width: '48%'
                                }}
                            >
                                <CatalogCard
                                    product={item}
                                    onPressHandler={(productId: number) => {
                                        navigation.navigate("CatalogItemScreen", { activeProductId: String(productId) });
                                    }}
                                />
                            </AnimatedWrapper>
                        )}
                        style={{
                            paddingBottom: 150
                        }}
                    />
                </>
            }
        </View>
    )
};

export default CatalogScreen;

// utils
function getFiltredCatalogBySelectedCategory(activeCategoryId: number, catalogList: IProductItem[]) {
    let filtredList: IProductItem[];

    if (activeCategoryId === SYSTEM_SALE_CATEGORY_ID) {
        filtredList = catalogList.filter((product) => product.price.sale !== null);
    } else if (activeCategoryId === SYSTEM_TOP_CATEGORY_ID) {
        filtredList = catalogList.filter((product) => product.sort_order === 1);
    } else {
        filtredList = catalogList.filter((product) => product.category_id === +activeCategoryId);
    }

    return filtredList;
}

// styles
const styles = StyleSheet.create({
    screenWrap: {
        marginTop: 20,
        paddingBottom: 20,
        backgroundColor: Colors.pale,
        height: '100%'
    },
    backButtonWrap: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        marginBottom: 20
    },
    loaderWrap: {
        width: "100%",
        height: "80%",
        alignItems: "center",
        justifyContent: "center"
    },
    endMessage: {
        textAlign: "center",
        paddingBottom: 10,
        color: Colors.gray,
        fontFamily: Fonts.openSans400,
        fontSize: 14,
    },
    pagLoaderContainer: {
        width: "100%",
        alignItems: "center",
    },
    pagLoaderWrap: {
        height: 50,
        width: 215,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        backgroundColor: Colors.blue,
        borderTopRightRadius: 23,
        borderTopLeftRadius: 23,
    },
    pagLoaderCircle: {
        backgroundColor: Colors.pale,
        borderRadius: "50%"
    },
    pagLoaderText: {
        fontFamily: Fonts.comfortaa700,
        color: Colors.pale,
    }
});
